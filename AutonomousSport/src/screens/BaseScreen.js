import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, AppState, Alert } from 'react-native';
import Util from '@/utils/Util';
// import firebase from 'react-native-firebase';
import { onClickView } from '@/utils/ViewUtil';
import PopupDialog from 'react-native-popup-dialog';
import { Button } from 'react-native-elements';
import TextStyle from '@/utils/TextStyle';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  moderateScale,
  scale as scaleSize,
  verticalScale
} from 'react-native-size-matters';
import _ from 'lodash';

import Room from '@/models/Room';
import BleManager from 'react-native-ble-manager';
import SoundPlayer from 'react-native-sound-player';
import ApiService from '@/services/ApiService';
import Constants, { Config, pubnub } from '@/utils/Constants';
// import PubNubReact from 'pubnub-react';

export const TAG = 'BaseScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  button: {
    borderRadius: verticalScale(25),
    borderWidth: 1,
    minWidth: '35%',
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#ffc500',
    marginRight: 0,
    marginLeft: 0
  }
});
const CONFIG_VOICE = {
  speechRate: 0.5,
  speechPitch: 1.25
};
class BaseScreen extends Component {
  constructor(props) {
    super(props);
    this.onClickView = onClickView;
    this.pubnub = pubnub;
    // this.pubnub = new PubNubReact(Config.PUBNUB_API_KEY);
    // this.pubnub.init(this);
    this.state = {
      roomInfo: null,
      playername: '',
      errorMessage: false
    };
    this.chanelGroupInviteKey = {
      channelTemplate: 'CH_USER_STATUS_',
      subscribe: {
        channels: []
      },
      listener: {
        message: data => {
          const { message = {}, channel = '' } = data;
          console.log('BaseScreen channel Invite message', message);
          if (
            channel === this.chanelGroupInviteKey.subscribe.channels[0] &&
            !_.isEmpty(message)
          ) {
            const room = new Room(message);

            console.log('BaseScreen room cover', room.cover);
            this.setState({
              errorMessage: false,
              roomInfo: room,
              playername: message.inviter
            });
            this.showDialogInvite(true);
          }
        }
      }
    };
    this.playingVoice = false;
    this.appState = AppState.currentState;
  }

  initVoice = () => {
    this.initializedVoice = false;
    try {
      SoundPlayer.onFinishedPlaying((success: boolean) => {
        this.playingVoice = false;
      });

      this.initializedVoice = true;
    } catch (error) {}
  };

  readText = async (fileName: String) => {
    try {
      if (this.initializedVoice && fileName && !this.playingVoice) {
        console.log(TAG, ' readText = ', fileName);
        this.playingVoice = true;
        SoundPlayer.playSoundFile(fileName, 'mp3');
      }
    } catch (error) {}
  };

  componentWillMount() {
    this.pubnub.addListener(this.chanelGroupInviteKey.listener);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.initVoice();
  }

  componentWillUnmount() {
    this.unmountPubnub();
    SoundPlayer.unmount();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  renderToastMessage = () => {
    return <Toast position="center" ref="toast" />;
  };
  showToastMessage = (text = '', callback = null) => {
    if (text && this.refs.toast) {
      this.refs.toast.show(text, 700, callback);
    }
  };

  unmountPubnub = () => {
    this.pubnub.removeListener(this.chanelGroupInviteKey.listener);
    this.pubnub.unsubscribe(this.chanelGroupInviteKey.subscribe);
  };

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
        // console.log('Connected peripherals: ' + peripheralsArray?.length);
      });
    }
    this.appState = nextAppState;
  };

  isForeground = ()=>{
    return this.appState.match(/inactive|background/) && AppState.currentState === 'active';
  }

  onPressBack = () => {
    this.props.navigation?.goBack();
  };

  initDialogInvite = (
    onPressDecline = () => {
      this.showDialogInvite(false);
    },
    onPressJoinNow = async () => {
      try {
        const { roomInfo } = this.state;
        //call to APIs get infor....
        if (!_.isEmpty(roomInfo)) {
          console.log(TAG, ' onPressJoinNow - joinRoom = ', roomInfo);
          const response = await ApiService.joinRoom({
            session: roomInfo.session
          });
          console.log(TAG, ' onPressJoinNow - joinRoom = ', response);
          if (response?.room?.token) {
            this.replaceScreen(
              this.props.navigation,
              'ChallengeScreen',
              response.room
            );
          } else {
            this.setState({ errorMessage: true });
          }
        }
      } catch (error) {
      } finally {
        this.showDialogInvite(false);
      }
    }
  ) => {
    const userInfo = this.props.user?.userInfo || {};
    const fbuid = userInfo?.fbuid || '';
    console.log('BaseScreen fbuid', fbuid);
    if (!_.isEmpty(userInfo)) {
      const channelName = `${
        this.chanelGroupInviteKey.channelTemplate
      }${userInfo.id || ''}`;
      this.chanelGroupInviteKey.subscribe.channels = [channelName];
      this.pubnub.subscribe(this.chanelGroupInviteKey.subscribe);
    }
    const { roomInfo = {}, playername = '', errorMessage = '' } = this.state;
    const uri =
      roomInfo?.cover ||
      'https://storage.googleapis.com/oskar-ai/1/HongKong_nNYONeB1BpzY331lNoD9.jpg';
    return (
      <PopupDialog
        width="50%"
        height="35%"
        hasOverlay
        dismissOnTouchOutside={false}
        ref={popupDialog => {
          this.popupInviteDialog = popupDialog;
        }}
      >
        <View
          style={{ flex: 1, flexDirection: 'row', padding: verticalScale(10) }}
        >
          <Image
            style={[{ width: '40%', height: '100%', resizeMode: 'cover' }]}
            source={{ uri: uri }}
          />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text
              style={[
                TextStyle.mediumText,
                {
                  color: 'black',
                  flex: 1,
                  paddingHorizontal: 10,
                  textAlign: 'left'
                }
              ]}
            >
              <Text style={[TextStyle.mediumText, { fontWeight: 'bold' }]}>
                {playername}
              </Text>
              <Text style={[TextStyle.mediumText, {}]}>
                {' '}
                invited you to join his race in
                {' '}
              </Text>

              <Text
                style={[
                  TextStyle.mediumText,
                  { fontWeight: 'bold', color: 'black' }
                ]}
              >
                {`${roomInfo?.name || ''} (${roomInfo?.miles || '0'} Miles)`}
              </Text>
            </Text>

            {errorMessage ? (
              <Text
                style={[
                  TextStyle.mediumText,
                  {
                    color: 'black',
                    flex: 1,
                    paddingHorizontal: 10
                  }
                ]}
              >
                Sorry, Your room not already to join.
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button
                title="Decline"
                buttonStyle={{ backgroundColor: 'transparent' }}
                onPress={onPressDecline}
                containerViewStyle={[
                  styles.button,
                  {
                    borderWidth: 0
                  }
                ]}
                textStyle={[
                  TextStyle.normalText,
                  { fontWeight: 'bold', color: 'black' }
                ]}
              />
              <Button
                title="Join now"
                onPress={onPressJoinNow}
                buttonStyle={{ backgroundColor: 'transparent' }}
                containerViewStyle={[
                  styles.button,
                  {
                    backgroundColor: '#ffc500'
                  }
                ]}
                textStyle={[
                  TextStyle.normalText,
                  { fontWeight: 'bold', color: '#534c5f' }
                ]}
              />
            </View>
          </View>
        </View>
      </PopupDialog>
    );
  };

  showDialogInvite = isShow => {
    if (this.popupInviteDialog) {
      isShow ? this.popupInviteDialog.show() : this.popupInviteDialog.dismiss();
    }
  };

  replaceScreen = (navigation, routeName, params = {}) => {
    Util.resetRoute(navigation, routeName, params);
  };
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
