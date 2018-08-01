import React from 'react';
import { View, Text } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';

import { Button } from 'react-native-elements';
import styles from './styles';
import BikerProfile from '@/components/BikerProfile';
import Room from '@/models/Room';

export const TAG = 'ChallengeScreen';
const dataTest = {
  id: 1,
  userId: 1,
  createdAt: '2018-07-24T11:14:18+07:00',
  updatedAt: '2018-07-24T11:14:18+07:00',
  deletedAt: null,
  name: '',
  session:
    '1_MX40NjE1NDQyMn5-MTUzMjQwNTY1ODI1NH5qVG5McnlvcjAxaE9IY01mdC9ya3NpTVR-fg',
  token:
    'T1==cGFydG5lcl9pZD00NjE1NDQyMiZzaWc9YTIxMGI3MDZhOTY0NTczNDFlMTEzODJmYTcwNTA1MjZiOTdlNmZmMjpzZXNzaW9uX2lkPTFfTVg0ME5qRTFORFF5TW41LU1UVXpNalF3TlRZMU9ESTFOSDVxVkc1TWNubHZjakF4YUU5SVkwMW1kQzl5YTNOcFRWUi1mZyZjcmVhdGVfdGltZT0xNTMyNDA1NjU4Jm5vbmNlPTk1MDI4NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMyNDkyMDU4',
  win: 0
};
export default class ChallengeScreen extends BaseScreen {
  static navigationOptions = {
    title: 'Challenge'
  };
  constructor(props) {
    super(props);
    const room: Room = new Room(props.navigation?.state.params || dataTest);
    this.state = {
      room: room
    };
  }

  componentDidMount() {}

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  renderMap = () => {
    return (
      <View style={styles.map}>
        <Text style={{ fontSize: 20, color: 'white' }}>
Map
        </Text>
      </View>
    );
  };

  render() {
    const { room } = this.state;
    return (
      <View style={styles.container}>
        {this.renderMap()}
        <View style={{alignItems:'center'}}>
          <BikerProfile room={room} />
          <Button
            title="Get ready"
            buttonStyle={{ backgroundColor: 'green' }}
          />
        </View>
      </View>
    );
  }
}

ChallengeScreen.propTypes = {};

ChallengeScreen.defaultProps = {};
