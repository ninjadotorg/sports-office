import React from 'react';
import { View, Text } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button } from 'react-native-elements';
import styles from './styles';
import RoomList from '@/components/RoomList';
import { TAG as TAGCREATE } from '@/screens/Create';

export const TAG = 'HomeScreen';

export default class HomeScreen extends BaseScreen {
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

  onPressCreateRoom = () => {
    this.props?.navigation?.navigate(TAGCREATE);
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 10
          }}
        >
          <Button
            title="Create Room"
            buttonStyle={styles.button}
            onPress={this.onPressCreateRoom}
          />
          <Button title="Join Room" buttonStyle={styles.button} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1
          }}
        >
          <RoomList />
        </View>
      </View>
    );
  }
}

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};
