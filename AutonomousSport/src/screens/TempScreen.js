import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export const TAG = 'TempScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
class TempScreen extends Component {
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
export default TempScreen;
