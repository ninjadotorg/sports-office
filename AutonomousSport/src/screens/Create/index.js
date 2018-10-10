import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';

import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGNEWROOM } from '@/screens/NewRoom';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';

import images, { icons } from '@/assets';
import RoomList from '@/components/RoomList';

import { connect } from 'react-redux';
import { fetchUser } from '@/actions/UserAction';

export const TAG = 'CreateRoomScreen';

class CreateRoomScreen extends BaseScreen {
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

    this.updateIndex = this.updateIndex.bind(this);
  }

  componentDidMount() {}

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
    console.log('updateIndex-levelIndex', selectedIndex);
  }

  onPressCreateRoom = this.onClickView(async () => {
    this.props.navigation.navigate(TAGNEWROOM);
  });

  onPressRandom = this.onClickView(async () => {
    console.log(TAG, ' onPressRandomJoin 1 ');
    try {
      this.setState({
        isLoading: true
      });

      const roomInfo = await ApiService.joinRandomRoom({});
      console.log(TAG, ' onPressRandomJoin 2 roomInFo ', roomInfo);
      if (roomInfo) {
        this.replaceScreen(
          this.props.navigation,
          TAGCHALLENGE,
          roomInfo.toJSON()
        );
      }
    } catch (error) {
    } finally {
      this.setState({
        isLoading: false
      });
    }
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
        <RoomList levelIndex={this.state.selectedIndex} />
        <View style={styles.containerBottom}>
          <Button
            title="Random"
            textStyle={[
              TextStyle.mediumText,
              { fontWeight: 'bold', color: '#02BB4F' }
            ]}
            buttonStyle={[styles.button]}
            onPress={this.onPressRandom}
          />
          <Button
            title="New Racing"
            buttonStyle={[styles.button, { backgroundColor: '#02BB4F' }]}
            textStyle={[TextStyle.mediumText, { fontWeight: 'bold' }]}
            onPress={this.onPressCreateRoom}
          />
        </View>
        {this.initDialogInvite()}
      </View>
    );
  }
}

CreateRoomScreen.propTypes = {};

CreateRoomScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser }
)(CreateRoomScreen);
