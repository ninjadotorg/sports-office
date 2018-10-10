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
    backgroundColor: 'transparent',
    borderColor: '#02BB4F',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
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
      //this.replaceScreen(this.props.navigation,TAGCHALLENGE,roomInfo);
      //call to APIs get infor....
        console.log(TAG, ' onPressJoinNow - joinRoom = ', this.state.roomInfo);
        const response = await ApiService.joinRoom({session: this.state.roomInfo.session});
        // const url = Api.JOIN_ROOM;
        // const response = await ApiService.getURL(METHOD.POST, url, {
        //   session: this.state.roomInfo.session
        // });
        console.log(TAG, ' onPressJoinNow - joinRoom = ', response);
        this.replaceScreen(this.props.navigation,"ChallengeScreen",response.room);


    }
  ) => {

    
    const fbuid = this.props.user?.userInfo?.fbuid || "";
    console.log("BaseScreen fbuid",fbuid);
    if(fbuid !=""){
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

    return (
      <PopupDialog
        width="70%"
        height="70%"
        hasOverlay
        dismissOnTouchOutside={false}
        ref={popupDialog => {
          this.popupInviteDialog = popupDialog;
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', flex: 1, padding: 20 }}> 
            <View style={{ flex: 1 }}>
            <Image style={[{ width:100, height:100, resizeMode:  'cover' }]} source={{uri:this.state.roomInfo?.Map?.cover }}    
             />
              <Text
                style={[
                  TextStyle.mediumText,
                  {
                    color: 'black',
                    flex: 1,
                    textAlignVertical: 'center'
                  }
                ]}
              > 
                <Text style={{fontWeight: "bold"}}>  {this.state.playername }</Text>
                <Text> invited you to join his race in </Text>
                <Text style={{fontWeight: "bold"}}>{this.state.roomInfo?.Map?.name }</Text>
                <Text> ({ this.state.roomInfo?.miles} Miles)</Text>
              
              </Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around' }}
              >
                <Button
                  title="Decline"
                  onPress={onPressDecline}
                  buttonStyle={[
                    styles.button,
                    {
                      borderWidth: 0,
                      alignSelf: 'center'
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
                  buttonStyle={[
                    styles.button,
                    {
                      backgroundColor: '#02BB4F',
                      alignSelf: 'center'
                    }
                  ]}
                  textStyle={[TextStyle.mediumText, { fontWeight: 'bold' }]}
                />
              </View>
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
 
