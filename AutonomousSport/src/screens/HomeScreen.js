import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export const TAG = 'HomeScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
export default class HomeScreen extends Component {
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

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};
