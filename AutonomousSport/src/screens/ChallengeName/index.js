import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button, Header, ButtonGroup } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth, color } from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { TAG as INVITEFRIENDS } from '@/screens/Friends';
import { TAG as TAGHOME } from '@/screens/Home';

import images, { icons } from '@/assets';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import { fetchAllUser, fetchAllFriend } from '@/actions/FriendAction';
import { leftRoom } from '@/actions/RoomAction';

export const TAG = 'ChallengeNameScreen';

const sizeImageCenter = moderateScale(130);
class ChallengeNameScreen extends BaseScreen {
  constructor(props) {
    super(props);
    const sumMiles = this.props.navigation.getParam('miles') || 0;
    const mapId = this.props.navigation.getParam('mapId') || -1;
    const loop = this.props.navigation.getParam('loop') || 1;

    console.log(TAG, ' contructor mapID = ', mapId);
    this.state = {
      valueRound: 1,
      sumMiles: sumMiles,
      mapId: mapId,
      loop: loop,
      error: '',
      isLoading: false,
      roomInfo: null
    };
  }

  componentDidMount() {
    var listfriend = this.props.invitedlist;

    console.log('changeName, listfriend ', listfriend);
  }

  onPressCreateRoom = this.onClickView(async () => {
    try {
      this.setState({
        isLoading: true
      });

      const { valueRound, mapId, sumMiles } = this.state;
      var listfriend = this.props.invitedlist;

      const roomInfo = await ApiService.createRoom({
        mapId: mapId,
        loop: valueRound,
        miles: sumMiles,
        name: this.name._lastNativeText
      });
      this.state.roomInfo = roomInfo;

      // console.log(TAG, ' onPressCreateRoom roomInFo ', roomInfo);
      // if (roomInfo) {
      //     console.log("onPressInviteChangeName roomInfo", roomInfo);
      //     var session  =  roomInfo.session ;
      //     try {

      //         if(name !=""){
      //           ApiService.sendUpdateRoomName({ name:name , session:session });
      //         }
      //       } catch (error) {

      //       }
      // }

      if (listfriend.length > 0) {
        for (var i = 0; i < listfriend.length; i++) {
          // console.log(
          //   'onPressInviteChangeName invited',
          //   listfriend[i],
          //   roomInfo.session
          // );
          try {
            ApiService.sendInviteRoom({
              userid: listfriend[i].id,
              session: roomInfo.session
            });
          } catch (error) {}
        }
      }
      // this.setState({
      //   isLoading: false
      // });

      this.replaceScreen(
        this.props.navigation,
        TAGCHALLENGE,
        roomInfo.toJSON()
      );
      //this.replaceScreen(this.props.navigation,TAGCHALLENGE,{"roomInfo": roomInfo.toJSON() } );
    } catch (error) {
      console.log('onPressInviteChangeName error', error);
      this.setState({
        isLoading: false
      });
    } finally {
    }
  });

  onPressBack = () => {
    // const { roomInfo } = this.state;
    // this.props.leftRoom({ session: roomInfo?.session });
    // this.replaceScreen(this.props.navigation, TAGHOME);
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
          <Image
            source={images.ic_backtop}
            style={{ width: 32, height: 32, marginTop: 12 }}
          />
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                marginHorizontal: 10,
                marginLeft: 20,
                marginTop: 10
              }
            ]}
          >
            Set name for the race
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { valueRound, sumMiles = 0, isLoading = false } = this.state;

    return (
      <ImageBackground style={[styles.container]} source={images.backgroundx}>
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            outerContainerStyles={{ borderBottomWidth: 0 }}
          >
            {this.renderLeftHeader()}
          </Header>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around'
              }}
            >
              <View style={styles.containerInput}>
                <Text style={[TextStyle.normalText, styles.textLabel]}>
                  Name
                </Text>

                <TextInput
                  underlineColorAndroid="transparent"
                  ref={name => {
                    this.name = name;
                  }}
                  maxLength={50}
                  disableFullscreenUI
                  style={[
                    TextStyle.normalText,
                    styles.text,
                    { flex: 2, color: 'white' }
                  ]}
                  placeholderTextColor={color.placeHolder}
                  placeholder="Central Park"
                />
              </View>
              <Button
                loading={isLoading}
                title="Next"
                textStyle={[
                  TextStyle.mediumText,
                  { fontWeight: 'bold', color: '#4e4759' }
                ]}
                buttonStyle={{ backgroundColor: 'transparent' }}
                containerViewStyle={[styles.button, {}]}
                onPress={this.onPressCreateRoom}
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

ChallengeNameScreen.propTypes = {};

ChallengeNameScreen.defaultProps = {};

export default connect(
  state => ({
    invitedlist: state.friend.invitedlist
  }),
  { fetchAllUser, fetchAllFriend, leftRoom }
)(ChallengeNameScreen);
