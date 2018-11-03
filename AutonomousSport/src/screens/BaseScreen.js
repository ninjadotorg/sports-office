import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
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
//import { TAG as TAGCHALLENGE } from '@/screens/Challenge';


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
class BaseScreen extends Component {
  constructor(props) {
    super(props);
    this.onClickView = onClickView;

    this.state={
      roomInfo:null,
      playername:"",
    };
    
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
      if(!_.isEmpty(roomInfo) && !_.isEmpty(roomInfo.session)){
        console.log(TAG, ' onPressJoinNow - joinRoom = ', roomInfo);
        const response = await ApiService.joinRoom({session: roomInfo.session});
        console.log(TAG, ' onPressJoinNow - joinRoom = ', response);
        this.replaceScreen(this.props.navigation,"ChallengeScreen",response.room);
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
              this.setState({roomInfo: room, playername:data.inviter }); 
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
 
