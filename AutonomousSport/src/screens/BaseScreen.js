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

   
    
  }
   

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  
  initDialogInvite = (  
    onPressDecline = ()=>{
        this.showDialogInvite(false);
    },
    onPressJoinNow = ()=>{
      
    }
  ) => {

    
    const fbuid = this.props.user?.userInfo?.fbuid || "";
    console.log("BaseScreen fbuid",fbuid);
    if(fbuid !=""){
        this.dataPrefference = firebase.database().ref("users/"+fbuid);
        this.dataPrefference.on('value', dataSnap => {
            if(dataSnap.val() ){
              console.log("BaseScreen dataPrefference",dataSnap);
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
            <Image style={{ alignSelf: 'center' }} source={images.ic_gold} />
            <View style={{ flex: 1 }}>
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
                Eva Canada invited you to join his race in Central Park (124
                Miles)
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
 
