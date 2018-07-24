import React from 'react';
import { View } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';

import styles from './styles';
import BikerProfile from '@/components/BikerProfile';

export const TAG = 'ChallengeScreen';

export default class ChallengeScreen extends BaseScreen {
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
    return (
      <View style={styles.container}>
        <BikerProfile />
      </View>
    );
  }
}

ChallengeScreen.propTypes = {};

ChallengeScreen.defaultProps = {};
