import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, AppState, } from 'react-native';
import Util from '@/utils/Util';
import firebase from 'react-native-firebase';
import { onClickView } from '@/utils/ViewUtil';
import PopupDialog from 'react-native-popup-dialog';
import { Button } from 'react-native-elements';
import TextStyle from '@/utils/TextStyle';
import {
  moderateScale,
  scale as scaleSize,
  verticalScale
} from 'react-native-size-matters';
import _ from 'lodash';
import images from '@/assets';
import { connect } from 'react-redux';
import { fetchUser,signIn,forGotPass, loginWithFirebase } from '@/actions/UserAction';
import Api from '@/services/Api';
import METHOD from '@/services/Method';
import ApiService from '@/services/ApiService';
import Room from '@/models/Room';
import BleManager from 'react-native-ble-manager';
import Tts from 'react-native-tts';

export const TAG = 'BaseScreen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  button: {
    borderRadius: 25,
    borderWidth: 1,
    width: '35%',
    height: verticalScale(50),
    backgroundColor: 'transparent',
    borderColor: '#21c364',
    marginRight:0,
    marginLeft:0,
    // minWidth: scaleSize(100),
    // paddingHorizontal: scaleSize(18)
  }
});
const CONFIG_VOICE ={
  speechRate: 0.5,
  speechPitch: 1
}
class BaseScreen extends Component {
  constructor(props) {
    super(props);
    this.onClickView = onClickView;
    
    this.state={
      roomInfo:null,
      playername:"",
      errorMessage:false,
    };
    this.appState = AppState.currentState;
    this.initVoice();
  }

  initVoice =()=>{
    this.initializedVoice = false;
    Tts.addEventListener("tts-start", event =>{}
    );
    Tts.addEventListener("tts-finish", event =>{}
    );
    Tts.addEventListener("tts-cancel", event =>{}
    );
    Tts.setDefaultRate(CONFIG_VOICE.speechRate);
    Tts.setDefaultPitch(CONFIG_VOICE.speechPitch);
    Tts.getInitStatus().then(async ()=>{
      const voices = await Tts.voices();
      const availableVoices = voices
        .filter(v => !v.networkConnectionRequired && !v.notInstalled)
        .map(v => {
          return { id: v.id, name: v.name, language: v.language };
        });
      let selectedVoice = null;
      if (voices && voices.length > 0) {
        selectedVoice = voices[0].id;
        try {
          await Tts.setDefaultLanguage('en-IE');
        } catch (err) {
          // My Samsung S9 has always this error: "Language is not supported"
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
          console.log(`setDefaultLanguage error `, err," language = ",voices[0].language);
        }
        await Tts.setDefaultVoice(voices[0].id);
        this.initializedVoice = true;
      } else {
        this.initializedVoice = true;
      }
    });
  }

  readText = async (text:String) => {
    if(this.initializedVoice && text){
      Tts.stop();
      Tts.speak(text);
    }
  };
  
  componentDidMount(){
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState)=>{
    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray?.length);
      });
    }
    this.appState = nextAppState;
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  
  initDialogInvite = (  
    onPressDecline = ()=>{
        this.showDialogInvite(false);
    },
    onPressJoinNow = async()=>{
      try {
        const {roomInfo} = this.state;
        //call to APIs get infor.... 
        console.log(TAG, ' onPressJoinNow - joinRoom = ', this.state.roomInfo);
        const response = await ApiService.joinRoom({session: this.state.roomInfo.session});
        console.log(TAG, ' onPressJoinNow - joinRoom = ', response);
        if(response?.room){
            this.replaceScreen(this.props.navigation,"ChallengeScreen",response.room);
        }else{
          this.showDialogInvite(false);
          this.setState({errorMessage:true});
        } 

      } catch (error) {
        
      }
      
    }
  ) => {

    const fbuid = this.props.user?.userInfo?.fbuid || "";
    console.log("BaseScreen fbuid",fbuid);
    if(!_.isEmpty(fbuid)){
        this.dataPrefference = firebase.database().ref("users/"+fbuid);
        this.dataPrefference.on('value', dataSnap => {  
            const data = dataSnap.val();

            if( data ){
             
              const room = new Room(data.room);
              console.log("BaseScreen room cover", room.Map.cover);  
                
              this.setState({ errorMessage:false, roomInfo: room, playername:data.inviter }); 
              this.dataPrefference.remove();
              this.showDialogInvite(true);
            }
        });
    } 
    const uri = 'https://storage.googleapis.com/oskar-ai/1/HongKong_nNYONeB1BpzY331lNoD9.jpg' || this.state.roomInfo?.Map?.cover;
    return (
      <PopupDialog
        width="80%"
        height="60%"
        hasOverlay
        dismissOnTouchOutside={false}
        ref={popupDialog => {
          this.popupInviteDialog = popupDialog;
        }}
      >
        <View style={{ flex: 1 ,flexDirection: 'row', padding: 20}}>
          <Image style={[{ width:'40%', height:'100%', resizeMode:  'cover' }]} source={{uri:uri }} />
          <View style={{ flexDirection: 'column', flex: 1 }}> 
           
              <Text
                style={[
                  TextStyle.mediumText,
                  {
                    lineHeight:35,
                    color: 'black',
                    flex: 1,
                    paddingHorizontal: 10
                  }
                ]}
              > 
                <Text style={[
                  TextStyle.mediumText,
                  { fontWeight: 'bold' }
                ]}>  {this.state.playername }</Text>
                <Text style={[
                  TextStyle.mediumText,
                  { }
                ]}> invited you to join his race in </Text>

                <Text style={[
                  TextStyle.mediumText,
                  { fontWeight: 'bold', color: 'black' }
                ]}> {`${this.state.roomInfo?.Map?.name || ''} (${this.state.roomInfo?.miles||'0'} Miles)`}</Text>
              
              </Text>

              { this.state.errorMessage ? 
                  <Text style={[ TextStyle.mediumText,{ lineHeight:35, color: 'black', flex: 1, paddingHorizontal: 10 }]}> 
                     zSorry, Your room not aready to join.
                  </Text>
               : null }
              <View
                style={{flexDirection: 'row',justifyContent: 'flex-end'}}
              >
                <Button
                  title="Decline"
                  buttonStyle={{ backgroundColor:'transparent'}}
                  onPress={onPressDecline}
                  containerViewStyle={[
                    styles.button,
                    {
                      borderWidth:0
                    }
                  ]}
                  textStyle={[
                    TextStyle.mediumText,
                    { fontWeight: 'bold', color: 'black' }
                  ]}
                />
                <Button
                  title="Join now"
                  onPress={onPressJoinNow}
                  buttonStyle={{backgroundColor:'transparent'}}
                  containerViewStyle={[
                    styles.button,
                    {
                     
                      backgroundColor: '#21c364'
                    }
                  ]}
                  textStyle={[TextStyle.mediumText, { fontWeight: 'bold' ,textAlign:'center'}]}
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

  get firebase() { 
    return firebase;
  }

  replaceScreen = (navigation, routeName, params = {}) => {
    Util.resetRoute(navigation, routeName, params);
  };
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
 
