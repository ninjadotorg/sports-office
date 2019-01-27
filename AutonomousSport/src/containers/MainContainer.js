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
import { notifyMessage } from '@/actions/P2PAction';
import CommandP2P from '@/models/CommandP2P';

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
    this.isOpeningServerSocket = false;
    this.isReadySendMessage = false;
    this.device = {};
    this.startDiscovering = null;
  }

  handleNewInfo = (info, secondParam) => {
    console.log(TAG, ' handleNewInfo info = ', info);
    const {
      isGroupOwner = undefined,
      groupFormed = undefined,
      groupOwnerAddress = undefined
    } = info || {};
    // if(!Util.isMirror() && !this.isReadySendMessage){
    //   this.onGetConnectionInfo();
    // }
    
    if (!_.isEmpty(groupOwnerAddress)) {
      // if(!this.device){
        this.createEventP2P();
      // }
    }
  };

  handleNewPeers = peers => {
    if (!_.isEmpty(peers)) {
      const first = peers[0];
      if (!_.isEmpty(first) && first.status === 0) {
        console.log(TAG, ' handleNewPeers status = 0 , peer =', first);
        this.device = first;
        this.createEventP2P();
      }
    }
  };

  createEventP2P = () => {
    this.onGetConnectionInfo().then(result => {
      this.isReadySendMessage = result && result > 0;
      if (this.isReadySendMessage) {
        
        if (Util.isMirror()) {
          console.log(TAG, ' handleNewPeers 01  mirror receiveMessage');
          this.onReceiveMessage();
        } else {
          // Util.timeout(() => {
          //   console.log(TAG, ' handleNewPeers 02  device sendMessage');
          // }, 3);
          // this.onSendMessage();
        }
      }
    });
  };

  connectDevice = (firstDevice = {}) => {
    return new Promise((resolve, reject) => {
      console.log(TAG, ' connectDevice = ', firstDevice);
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
    if (!this.isOpeningServerSocket) {
      this.isOpeningServerSocket = true;
      receiveMessage()
        .then(msg => {
          console.log('Message received successfully', msg);

          try {
            this.showToastMessage('Message OKKKK = ' + msg);
            const msgData = JSON.parse(!_.isEmpty(msg)?msg:'')||{};
            console.log('Message received successfully 01');
            if (msgData && msgData.action) {
              console.log('Message received successfully 02');
              const { store } = this.state;
              const commandMessage = new CommandP2P(msgData.action, msgData.data);
              console.log('Message received successfully 03');
              notifyMessage(commandMessage)(store?.dispatch);
            }
          } catch (error) {
          } finally {
            this.isOpeningServerSocket = false;
            this.onReceiveMessage();
          }
        })
        .catch(err => {
          this.isOpeningServerSocket = false;
          console.log('Error while message receiving', err);
        });
    }else{
      return Promise.resolve(1);
    }
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
      }
      startDiscoveringPeers()
        .then(() => console.log('Sucessfull OKKKKKKKKKKK----'))
        .catch(err => console.log(err));
      this.startDiscovering = true;
      await Util.timeout(async () => {}, 3);
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

          const devices: [] = await this.onFindAndGetAvailablePeers();
          console.log(
            TAG,
            ' setConnectionDevice availablePeers',
            devices,
            ' result = ',
            result
          );
          // find device with status 3;
          const device = devices.find(item =>_.includes(String(item.deviceName).toLowerCase(), 'mirror') || item.status === 3);
          if (!_.isEmpty(device)) {
            await this.connectDevice(device);
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
          // await this.onRemoveGroup();
          result = await this.onCreateGroup();
          console.log(TAG, ' setConnectionMirror createGroup = ', result);
          // await this.onGetConnectionInfo();
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
