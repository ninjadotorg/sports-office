/**
 * @providesModule MainContainer
 */
import React, { Component } from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from '@/reducers';
import { StackRouter } from '@/routers';
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
      <Provider store={store}>
        <StackRouter />
      </Provider>
    );
  }
}
