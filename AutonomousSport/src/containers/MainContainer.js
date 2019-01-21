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
export default class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: createStore(reducers, applyMiddleware(...middleware))
    };
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
      </View>
    );
  }
}
