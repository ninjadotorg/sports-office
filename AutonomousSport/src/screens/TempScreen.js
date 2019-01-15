import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import BaseScreen from './BaseScreen';

export const TAG = 'TempScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  }
});
class TempScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  render() {
    return <View style={styles.container} />;
  }
}

TempScreen.propTypes = {};

TempScreen.defaultProps = {};
export default connect(
  state => ({}),
  {}
)(TempScreen);
