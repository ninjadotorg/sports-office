import React from 'react';
import { View, Text } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button } from 'react-native-elements';
import { FormLabel, FormInput } from 'react-native-elements';
import styles from './styles';

export const TAG = 'CreateRoomScreen';

export default class CreateRoomScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onPressCreateRoom = () => {};

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>
Name
        </FormLabel>
        <FormInput placeholder="Challenge me" />
        <Button
          title="Create"
          buttonStyle={styles.button}
          onPress={this.onPressCreateRoom}
        />
      </View>
    );
  }
}

CreateRoomScreen.propTypes = {};

CreateRoomScreen.defaultProps = {};
