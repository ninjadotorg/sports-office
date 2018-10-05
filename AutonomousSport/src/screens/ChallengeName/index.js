import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth,color } from './styles';  
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { TAG as INVITEFRIENDS } from '@/screens/Friends';
import { TAG as TAGHOME } from '@/screens/Home';

import images, { icons } from '@/assets';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import { fetchAllUser,fetchAllFriend } from '@/actions/FriendAction';
///friends:state.friend.friendList,
import { leftRoom } from '@/actions/RoomAction';

export const TAG = 'ChallengeNameScreen';


const sizeImageCenter = moderateScale(130);
class ChallengeNameScreen extends BaseScreen {
  constructor(props) {
    super(props);
    const mile = this.props.navigation.getParam('miles')||0;
    const roomInfo = this.props.navigation.getParam('roomInfo') || null ; 
    //const friendList = this.props.navigation.getParam('friendList') || null ; 
    console.log(TAG," ChallengeNameScreen roomInfo = ", roomInfo);
    const mapId = this.props.navigation.getParam('id')||-1;
    console.log(TAG," contructor mapID = ", mapId);
    this.state = {
      valueRound:1,
      mile:mile,
      mapId:mapId,
      sumMiles:mile,
      error:'',
      isLoading:false,
      roomInfo:roomInfo,
    };
  }

  componentDidMount() {
     
  }
 
  onPressCreateRoom = this.onClickView( () => {
    try {
      this.setState({
        isLoading:true
      });
      const {roomInfo} = this.state;
      if(roomInfo == null){
        return;
      }
      console.log("onPressInviteChangeName roomInfo", roomInfo); 
      var session  =  roomInfo.session ;//"1_MX40NjE1NDQyMn5-MTUzNzc4NjAxNzA2OX4xTkV2aU9pVnZITFFQTzhxSS9sdWZaVGp-fg";// this.state.roomInfo.session;
      var list = this.props.invitedlist;
      //var list =[{"id":109}, {"id":110}];

      //
      try {
          const name = this.name._lastNativeText;
          if(name !=""){
            ApiService.sendUpdateRoomName({ name:name , session:session });  
           }
        } catch (error) {  

        }  
        
      if(list.length >0){
         
         for(var i=0; i < list.length; i++){
          console.log("onPressInviteChangeName invited",list[i], session); 
          try {
            ApiService.sendInviteRoom({ userid: list[i].id, session:session });  
          } catch (error) {  
          } 
        } 
      } 
      //this.state.roomInfo
      this.replaceScreen(this.props.navigation,TAGCHALLENGE,roomInfo);
      //this.replaceScreen(this.props.navigation,TAGCHALLENGE,{"roomInfo": roomInfo.toJSON() } );
        //this.replaceScreen(this.props.navigation,INVITEFRIENDS,{"roomInfo":roomInfo.toJSON()});
      //} 
    } catch (error) {
       console.log("onPressInviteChangeName error",error); 
    }finally{
      
      this.setState({
        isLoading:false
      });
    }
  });
  
  onPressBack = ()=>{
    
    const { roomInfo } = this.state;
    this.props.leftRoom({ session: roomInfo?.session });
    this.replaceScreen(this.props.navigation, TAGHOME);
  }
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
    return (
      <TouchableOpacity style={styles.topBar} onPress={this.onPressBack}>
        {icons.back({
          containerStyle: { marginHorizontal: 0 },
          
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
        Set name for the race
        </Text>
      </TouchableOpacity>
    );
  };
  onPress = (direct)=>{
    let {valueRound,mile = 0} = this.state;
    valueRound = valueRound + (direct*1);
    valueRound = valueRound<=0?1:(valueRound>10?10:valueRound);
    this.setState({
      valueRound:valueRound,
      sumMiles:mile* valueRound
    });
  }
  render() {
    const {valueRound,sumMiles = 0,isLoading = false} = this.state;
    
    return (
      <View style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          
            <View style={styles.containerInput}>
                <Text style={[TextStyle.normalText,styles.textLabel]}>Name</Text>
                
                <TextInput
                  underlineColorAndroid="transparent"
                  ref={(name) => {
                    this.name = name;
                  }}
                  disableFullscreenUI={true}
                  style={[TextStyle.normalText,styles.text,{flex:2,color:'white'}]}
                  placeholderTextColor={color.placeHolder}
                  placeholder="Alice Smith"
                />
            </View>
          </View>
           
        </View>
        <View style={styles.containerBottom}>
          <Button
            loading={isLoading}
            title="Next"
            textStyle={[TextStyle.mediumText,{fontWeight:'bold',color:'#02BB4F'}]}
            buttonStyle={[styles.button]}
            onPress={this.onPressCreateRoom}
          />
        </View>
      </View>
    );
  }
}

ChallengeNameScreen.propTypes = {};

ChallengeNameScreen.defaultProps = {};
 

export default connect(
  state => ({
    invitedlist:state.friend.invitedlist,
  }),
  {fetchAllUser,fetchAllFriend,leftRoom}
)(ChallengeNameScreen);
