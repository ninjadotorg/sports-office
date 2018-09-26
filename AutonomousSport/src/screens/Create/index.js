import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';

import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGNEWROOM } from '@/screens/NewRoom';
import images, { icons } from '@/assets';
import RoomList from '@/components/RoomList';

export const TAG = 'CreateRoomScreen';

export default class CreateRoomScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Create'
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      mapList: [],
      selectedIndex: 0
    };
  }

  componentDidMount() {}

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  onPressCreateRoom = this.onClickView(async () => {
    this.props.navigation.navigate(TAGNEWROOM);
  });

  onPressBack = () => {
    this.props.navigation.goBack();
  };
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={this.onPressBack}
        >
          {icons.back({
            containerStyle: { marginHorizontal: 0 }
          })}
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                textAlignVertical: 'center',
                marginHorizontal: 10
              }
            ]}
          >
            Choose a race to start
          </Text>
        </TouchableOpacity>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={['Level 1', 'Level 2', 'Level 3', 'Level 4']}
          textStyle={[TextStyle.normalText, styles.textStyleButton]}
          selectedTextStyle={[
            TextStyle.normalText,
            styles.selectedTextStyleButton
          ]}
          underlayColor="transparent"
          selectedButtonStyle={styles.selectedButtonStyle}
          containerStyle={styles.buttonGroup}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Header backgroundColor="transparent">{this.renderLeftHeader()}</Header>
        <RoomList />

        <View style={styles.containerBottom}>
          <Button
            title="Random"
            textStyle={[
              TextStyle.mediumText,
              { fontWeight: 'bold', color: '#02BB4F' }
            ]}
            buttonStyle={[styles.button]}
            onPress={this.onPressCreateRoom}
          />
          <Button
            title="New Racing"
            buttonStyle={[styles.button, { backgroundColor: '#02BB4F' }]}
            textStyle={[TextStyle.mediumText, { fontWeight: 'bold' }]}
            onPress={this.onPressCreateRoom}
          />
        </View>
      </View>
    );
  }
}

CreateRoomScreen.propTypes = {};

CreateRoomScreen.defaultProps = {};
