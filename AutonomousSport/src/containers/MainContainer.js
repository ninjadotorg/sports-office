/**
 * @providesModule MainContainer
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from '@/reducers';
import { StackRouter } from '@/routers';
import { RNCamera } from 'react-native-camera';

import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
import _ from 'lodash';
import {
  initialize,
  isSuccessfulInitialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  unsubscribeFromConnectionInfoUpdates,
  subscribeOnConnectionInfoUpdates,
  subscribeOnPeersUpdates,
  connect,
  disconnect,
  createGroup,
  removeGroup,
  subscribeOnEvent,
  receiveMessage,
  sendMessage,
  getAvailablePeers,
  sendFile,
  receiveFile,
  getConnectionInfo,
  PEERS_UPDATED_ACTION
} from 'react-native-wifi-p2p';
import { BUILD_MODE } from '@/utils/Constants';

import Util from '@/utils/Util';
import ViewUtil from '@/utils/ViewUtil';

const reduxMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation
);
export const addListener = reduxifyNavigator(reduxMiddleware, 'root');
const middleware = [thunk, reduxMiddleware];
const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    opacity: 1,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  }
});
const TAG = 'MainContainer';
export default class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: createStore(reducers, applyMiddleware(...middleware))
    };

    this.device = {};
    this.startDiscovering = null;
  }

  handleNewInfo = (info, secondParam) => {
    console.log(TAG, ' handleNewInfo = ', info);
    if (!_.isEmpty(this.device)) {
      const first = this.device;
      if (!_.isEmpty(first) && first.status === 0) {
        console.log(TAG, ' handleNewInfo status = 0 ');
        this.onGetConnectionInfo().then(result => {
          if (result && result > 0) {
            if (Util.isMirror()) {
              console.log(TAG, ' handleNewInfo  mirror receiveMessage');
              this.onReceiveMessage();
            } else {
              Util.timeout(() => {
                console.log(TAG, ' handleNewInfo  device sendMessage');
                this.onSendMessage();
              }, 3);
            }
          }
        });
      }
    }
  };

  handleNewPeers = peers => {
    if (!_.isEmpty(peers)) {
      const first = peers[0];
      if (!_.isEmpty(first) && first.status === 0) {
        console.log(TAG, ' handleNewPeers status = 0 , peer =', peers);
        this.device = first;
      }
    }
  };

  connectToFirstDevice = (firstDevice = {}) => {
    return new Promise((resolve, reject) => {
      console.log(TAG, ' connectToFirstDevice = ', firstDevice);
      if (!_.isEmpty(firstDevice)) {
        connect(firstDevice.deviceAddress)
          .then(() => {
            console.log(TAG, ' Successfully connected');
            resolve(firstDevice);
          })
          .catch(err => {
            reject(err);
            console.log(TAG, 'P2P - error Details: ', err);
          });
      } else {
        resolve('');
      }
    });
  };

  onSendMessage = () => {
    sendMessage('Hello world!')
      .then(() => console.log('Message sent successfully'))
      .catch(err => console.log('Error while message sending', err));
  };

  onReceiveMessage = () => {
    receiveMessage()
      .then(msg => {
        console.log('Message received successfully', msg);
        this.onReceiveMessage();
        this.showToastMessage('Message OOOOOKKKK = ' + msg);
      })
      .catch(err => console.log('Error while message receiving', err));
  };

  disconnectFromDevice = async () => {
    try {
      await disconnect();
      console.log(TAG, ' Successfully disconnected');
    } catch (error) {
      return Promise.resolve(0);
    }
    return Promise.resolve(1);
  };

  showToastMessage = (text = '', callback = null) => {
    if (text && this.refs.toast) {
      this.refs?.toast.show(text, 1000, callback);
    }
  };

  componentDidMount = () => {
    if (Util.isMirror()) {
      this.setConnectionMirror().then(result => {
        console.log(TAG, ' componentDidMount set...Mirror = ', result);
      });
    } else {
      this.setConnectionDevice().then(result => {
        console.log(TAG, ' componentDidMount set...Device = ', result);
      });
    }
    subscribeOnPeersUpdates(({ devices }) => this.handleNewPeers(devices));
    subscribeOnConnectionInfoUpdates(this.handleNewInfo);
  };

  peers = async () => {
    const { devices = [] } = (await getAvailablePeers()) || {};
    return devices;
  };

  onFindAndGetAvailablePeers = async () => {
    try {
      if (!this.startDiscovering) {
        startDiscoveringPeers()
          .then(() => console.log('Sucessfull OKKKKKKKKKKK----'))
          .catch(err => console.log(err));
          this.startDiscovering = true;
          await Util.timeout(async () => {}, 3);
      }
      console.log(TAG, ' onFind...Peers begin');

      
      let devices = await this.peers();

      return devices;
    } catch (error) {}
    return null;
  };

  setConnectionDevice = async () => {
    try {
      if (!Util.isMirror()) {
        await initialize();
        let result = await isSuccessfulInitialize();
        if (result) {
          // await this.onRemoveGroup();
          // await this.disconnectFromDevice();

          const devices = await this.onFindAndGetAvailablePeers();
          console.log(
            TAG,
            ' setConnectionDevice availablePeers',
            devices,
            ' result = ',
            result
          );
          if (!_.isEmpty(devices)) {
            await this.connectToFirstDevice(devices[0]);
          } else {
            this.showToastMessage('Could not find Smart Mirror');
          }
          result = await this.onGetConnectionInfo();
          if (result && result > 0) {
            stopDiscoveringPeers();
            this.showToastMessage('P2P Successfully connected');
            return Promise.resolve(1);
          }
        }
        return Promise.resolve(0);
      }
    } catch (error) {
      return Promise.reject('Error: set...Device ' + error.message);
    }
    return Promise.resolve(1);
  };

  setConnectionMirror = async () => {
    try {
      if (Util.isMirror()) {
        await initialize();
        let result = await isSuccessfulInitialize();
        if (result) {
          // await this.disconnectFromDevice();
          await this.onRemoveGroup();
          result = await this.onCreateGroup();
          console.log(TAG, ' setConnectionMirror createGroup = ', result);
          await this.onGetConnectionInfo();
          return Promise.resolve(1);
        }
        return Promise.reject('error nha');
      }
    } catch (error) {
      return Promise.reject('error roiiiii - ' + error.message);
    }
    return Promise.resolve(1);
  };

  onGetConnectionInfo = async () => {
    try {
      const info = await getConnectionInfo();
      if (!_.isEmpty(info) && !_.isEmpty(info.groupOwnerAddress)) {
        return Promise.resolve(1);
      }
      console.log('onGetConnectionInfo ', info);
    } catch (error) {}
    return Promise.resolve(0);
  };

  onCreateGroup = async () => {
    try {
      await createGroup();
      return Promise.resolve(1);
    } catch (error) {}

    return Promise.resolve(0);
  };

  onRemoveGroup = async () => {
    try {
      await removeGroup();
      console.log('Currently you don\'t belong to group!');
    } catch (error) {
      return Promise.resolve(0);
    }
    return Promise.resolve(1);
  };

  componentWillUnmount() {
    stopDiscoveringPeers();
    unsubscribeFromConnectionInfoUpdates(event =>
      console.log('unsubscribeFromConnectionInfoUpdates', event)
    );
    unsubscribeFromPeersUpdates(event =>
      console.log('unsubscribeFromPeersUpdates', event)
    );
  }

  render() {
    const { store } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {/*<RNCamera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
        />*/}
        <Provider store={store}>
          <StackRouter />
        </Provider>
        {ViewUtil.Toast({ position: 'bottom' })}
      </View>
    );
  }
}
