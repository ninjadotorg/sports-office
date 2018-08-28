import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Util from '@/utils/Util';

export const TAG = 'BaseScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
class BaseScreen extends Component {
  constructor(props) {
    super(props);
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  replaceScreen = (navigation, routeName, params = {}) => {
    Util.resetRoute(navigation, routeName, params);
  };
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
