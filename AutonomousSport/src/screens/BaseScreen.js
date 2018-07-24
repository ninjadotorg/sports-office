import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

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
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
