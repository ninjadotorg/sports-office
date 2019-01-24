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
  receiveMessage,
  sendMessage,
  getAvailablePeers,
  sendFile,
  receiveFile,
  getConnectionInfo
} from 'react-native-wifi-p2p';
import Toast, { DURATION } from 'react-native-easy-toast';

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
      store: createStore(reducers, applyMiddleware(...middleware)),
      devices: []
    };
  }

  handleNewInfo = (info, secondParam) => {
    console.log(TAG, ' handleNewInfo = ', info);
  };

  // handleNewPeers = peers => {
  //   console.log(TAG, ' handleNewPeers =', peers);
  //   this.setState({ devices: peers }, () => {
  //     // temp
  //     this.connectToFirstDevice();
  //   });
  // };

  connectToFirstDevice = (devices = []) => {
    // const { devices = [] } = this.state;
    const firstDevice = devices[0] || {};
    console.log(TAG, ' connectToFirstDevice = ', firstDevice);
    connect(firstDevice.deviceAddress)
      .then(() => {
        console.log(TAG, ' Successfully connected');
        this.showToastMessage('P2P Successfully connected');
      })
      .catch(err => console.error(TAG, 'P2P- error Details: ', err));
  };

  onSendMessage = () => {
    sendMessage('Hello world!')
      .then(() => console.log('Message sent successfully'))
      .catch(err => console.log('Error while message sending', err));
  };

  onReceiveMessage = () => {
    receiveMessage()
      .then(msg => console.log('Message received successfully', msg))
      .catch(err => console.log('Error while message receiving', err));
  };

  disconnectFromDevice = () => {
    disconnect()
      .then(() => console.log(TAG, ' Successfully disconnected'))
      .catch(err =>
        console.error(TAG, ' Something gone wrong. Details: ', err)
      );
  };

  renderToastMessage = () => {
    return <Toast position="top" ref="toast" />;
  };
  showToastMessage = (text = '', callback = null) => {
    if (text && this.refs.toast) {
      this.refs?.toast.show(text, 500, callback);
    }
  };

  componentDidMount() {
    initialize();
    isSuccessfulInitialize().then(status =>
      console.log(TAG, ' componentDidMount isSuccessfulInitialize = ', status)
    );
    startDiscoveringPeers()
      .then(() => {
        console.log(TAG, ' componentDidMount startDiscoveringPeers Sucessfull');
        getAvailablePeers().then(({ devices }) => {
          // this.setState({
          //   devices: devices
          // });
          this.connectToFirstDevice(devices);
        });
      })
      .catch(err => console.log(err));
    // getAvailablePeers().then(peers =>
    //     console.log(TAG, ' getAvailablePeers ', peers)
    //   );
    // subscribeOnPeersUpdates(({ devices }) => this.handleNewPeers(devices));
  }

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
        <RNCamera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle="Permission to use camera"
          permissionDialogMessage="We need your permission to use your camera phone"
        />
        <Provider store={store}>
          <StackRouter />
        </Provider>
        {this.renderToastMessage()}
      </View>
    );
  }
}
