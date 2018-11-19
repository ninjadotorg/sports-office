import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button, Header, ButtonGroup } from 'react-native-elements';
import { TAG as TAGHOME } from '@/screens/Home';
import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGNEWROOM } from '@/screens/NewRoom';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import images, { icons } from '@/assets';
import RoomList from '@/components/RoomList';

import { connect } from 'react-redux';
import { fetchUser } from '@/actions/UserAction';
import Room from '@/models/Room';

export const TAG = 'CreateRoomScreen';
const component1 = () => <Text>Hello</Text>;
const component2 = () => <Text>World</Text>;
const component3 = () => <Text>ButtonGroup</Text>;
const buttons = [
  { element: component1 },
  { element: component2 },
  { element: component3 }
];

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

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
    console.log('updateIndex-levelIndex', selectedIndex);
  };

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
      if (roomInfo instanceof Room && roomInfo?.session && roomInfo?.token) {
        console.log(TAG, ' onPressRandomJoin 3 token ', roomInfo?.token);

        this.replaceScreen(
          this.props.navigation,
          TAGCHALLENGE,
          roomInfo.toJSON()
        );
      } else {
        ////
        console.log(
          TAG,
          ' onPressRandomJoin show message ',
          roomInfo['message']
        );
        this.showToastMessage(roomInfo['message']);
      }
    } catch (error) {
    } finally {
      this.setState({
        isLoading: false
      });
    }
  });

  onPressBack = () => {
    this.replaceScreen(this.props.navigation, TAGHOME);
    // this.props.navigation.goBack();
  };
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={this.onPressBack}
        >
          <Image source={images.ic_backtop} style={{ width: 32, height: 32 }} />
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginLeft: 20
              }
            ]}
          >
            Choose a race to start
          </Text>
        </TouchableOpacity>
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          <SegmentedControlTab
            values={['Level 1', 'Level 2', 'Level 3', 'Level 4']}
            selectedIndex={selectedIndex}
            onTabPress={this.updateIndex}
            tabsContainerStyle={[styles.buttonGroup, {}]}
            tabStyle={styles.buttonItemStyle}
            tabTextStyle={[TextStyle.mediumText, styles.textStyleButton]}
            activeTabStyle={styles.selectedButtonStyle}
            activeTabTextStyle={[
              TextStyle.mediumText,
              styles.selectedTextStyleButton
            ]}
            borderRadius={0}
          />
        </View>
      </View>
    );
  };
  render() {
    const { isLoading = false } = this.state;
    return (
      <ImageBackground
        style={[styles.containerimg]}
        source={images.backgroundx}
      >
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            outerContainerStyles={{ borderBottomWidth: 0 }}
          >
            {this.renderLeftHeader()}
          </Header>
          <RoomList levelIndex={this.state.selectedIndex} />
          <View style={styles.containerBottom}>
            <Button
              loading={isLoading}
              title="Random"
              textStyle={[
                TextStyle.mediumText,
                { fontWeight: 'bold', color: '#ffc500' }
              ]}
              buttonStyle={[styles.button]}
              onPress={this.onPressRandom}
            />
            <Button
              title="New Racing"
              buttonStyle={[
                styles.button,
                { backgroundColor: '#ffc500', borderColor: 'transparent' }
              ]}
              textStyle={[TextStyle.mediumText, { fontWeight: 'bold',color:'#534c5f' }]}
              onPress={this.onPressCreateRoom}
            />
          </View>
          {this.initDialogInvite()}
          {this.renderToastMessage()}
        </View>
      </ImageBackground>
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
