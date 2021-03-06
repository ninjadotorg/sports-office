import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, AppState, } from 'react-native';
import Util from '@/utils/Util';
import firebase from 'react-native-firebase';
import { onClickView } from '@/utils/ViewUtil';
import PopupDialog from 'react-native-popup-dialog';
import { Button } from 'react-native-elements';
import TextStyle from '@/utils/TextStyle';
import Toast, {DURATION} from 'react-native-easy-toast';
import {
  moderateScale,
  scale as scaleSize,
  verticalScale
} from 'react-native-size-matters';
import _ from 'lodash';
import images from '@/assets';
import Room from '@/models/Room';
import BleManager from 'react-native-ble-manager';
import Tts from 'react-native-tts';
import ApiService from '@/services/ApiService';

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
    height:45,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'transparent',
    borderColor: '#21c364',
    marginRight:0,
    marginLeft:0,
    paddingVertical:1
  }
});
const CONFIG_VOICE ={
  speechRate: 0.5,
  speechPitch: 1.25
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
  renderToastMessage = ()=>{
    return <Toast position='top' ref="toast"/>;
  }
  showToastMessage = (text = "",callback = null)=>{
    if(text && this.refs.toast){
      this.refs.toast.show(text,500,callback);
    }
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
      // const availableVoices = voices
      //   .filter(v => !v.networkConnectionRequired && !v.notInstalled)
      //   .map(v => {
      //     return { id: v.id, name: v.name, language: v.language };
      //   });
      let availableVoices = voices.filter(v =>  v.language.includes('en-US')&&v.language.includes('female'));
      if (availableVoices && availableVoices.length > 0) {

        let selectedVoice = availableVoices[0];
        console.log(`setDefaultVoice  `,selectedVoice);
        try {
          if(selectedVoice.notInstalled){
            await Tts.requestInstallEngine();
          };
          await Tts.setDefaultLanguage(selectedVoice.language);
          // await Tts.setDefaultLanguage('en-US');
        } catch (err) {
          // My Samsung S9 has always this error: "Language is not supported"
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
          console.log(`setDefaultLanguage error `, err," language = ",selectedVoice.language);
        }
        await Tts.setDefaultVoice(selectedVoice.id);

        // await Tts.setDefaultVoice('en-us-x-sfg#female_2-local');
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
        if(!_.isEmpty(roomInfo)){
          console.log(TAG, ' onPressJoinNow - joinRoom = ', roomInfo);
          const response = await ApiService.joinRoom({session: roomInfo.session});
          console.log(TAG, ' onPressJoinNow - joinRoom = ', response);
          if(response?.room?.token){
              this.replaceScreen(this.props.navigation,"ChallengeScreen",response.room);
          }else{
            // this.showDialogInvite(false);
            this.setState({errorMessage:true});
          } 
        } 

      } catch (error) {
        
      }finally{
        this.showDialogInvite(false);
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
              if(!_.isEmpty(room)){
                console.log("BaseScreen room cover", room.Map.cover);  
                this.setState({ errorMessage:false, roomInfo: room, playername:data.inviter }); 
                this.dataPrefference.remove();
                this.showDialogInvite(true);
              }
            }
        });
    } 
    const uri =  this.state.roomInfo?.Map?.cover||'https://storage.googleapis.com/oskar-ai/1/HongKong_nNYONeB1BpzY331lNoD9.jpg';
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
                    paddingHorizontal: 10,
                    textAlign:'left'
                  }
                ]}
              > 
                <Text style={[
                  TextStyle.mediumText,
                  { fontWeight: 'bold' }
                ]}>{this.state.playername||'' }</Text>
                <Text style={[
                  TextStyle.mediumText,
                  { }
                ]}> invited you to join his race in </Text>

                <Text style={[
                  TextStyle.mediumText,
                  { fontWeight: 'bold', color: 'black' }
                ]}>{`${this.state.roomInfo?.Map?.name || ''} (${this.state.roomInfo?.miles||'0'} Miles)`}</Text>
              
              </Text>

              { this.state.errorMessage ? 
                  <Text style={[ TextStyle.mediumText,{ lineHeight:35, color: 'black', flex: 1, paddingHorizontal: 10 }]}> 
                     Sorry, Your room not aready to join.
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
 
