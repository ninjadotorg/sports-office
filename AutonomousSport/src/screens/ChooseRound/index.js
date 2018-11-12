import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image,ImageBackground } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { TAG as INVITEFRIENDS } from '@/screens/Friends';

import images, { icons } from '@/assets';
import { moderateScale , verticalScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import { fetchUser } from '@/actions/UserAction';

export const TAG = 'ChooseRoundScreen';


const sizeImageCenter = verticalScale(150);
class ChooseRoundScreen extends BaseScreen {
  constructor(props) {
    super(props);
   
    const mile = this.props.navigation.getParam('miles')||0;
    const mapId = this.props.navigation.getParam('id')||-1;
    console.log(TAG," contructor mapID = ", mapId);
    this.state = {
      valueRound:1,
      mile:mile,
      mapId:mapId,
      sumMiles:mile,
      error:'',
      isLoading:false,
      roomInfo:null,
    };
  }

  componentDidMount() {
    this.props.getUser();
  }

  onPressCreateRoom = this.onClickView(async () => {
    
    // if( this.state.roomInfo !=null ){
    //   this.props.navigation.navigate(INVITEFRIENDS,{"roomInfo":this.state.roomInfo.toJSON()});
    //   return;
    // }
    const {valueRound,mapId,sumMiles} = this.state;
     

    this.props.navigation.navigate(INVITEFRIENDS,{"invitemode":true, "mapId":mapId,"loop":valueRound,"miles":sumMiles});
    return;

    try {
      this.setState({
        isLoading:true
      });
      const {valueRound,mapId,sumMiles} = this.state;
      if(sumMiles>0){
      const roomInfo = await ApiService.createRoom({
        mapId:mapId,
        loop:valueRound,
        miles:sumMiles
      });
      
      this.setState({
        roomInfo:roomInfo
      });

      console.log(TAG,' onPressCreateRoom roomInFo ' , roomInfo);
      if (roomInfo) {
        console.log(TAG,' onPressCreateRoom roomInFo ');
        // this.replaceScreen(this.props.navigation,TAGCHALLENGE,roomInfo.toJSON());
        //this.replaceScreen(this.props.navigation,INVITEFRIENDS,{"roomInfo":roomInfo.toJSON()});
        this.props.navigation.navigate(INVITEFRIENDS,{"roomInfo":roomInfo.toJSON()});

      }
    }else{
      this.setState({
        error:'number of round is not zero'
      });
    }
    } catch (error) {}finally{
      this.setState({
        isLoading:false
      });
    }
  });
  
  onPressBack = ()=>{
    this.props.navigation.goBack();
  }
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
    return (
      <View style={styles.topBar}>  
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={this.onPressBack}
        > 
        <Image source={images.ic_backtop}  style={{width:32, height:32, marginTop:12 }}/>
        <Text
          style={[
            TextStyle.mediumText,
            {
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              marginHorizontal: 10,
              marginLeft:20, 
              marginTop:10, 
            }
          ]}
        >
          Number of rounds
        </Text>
      </TouchableOpacity>
      </View>
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
      <ImageBackground style={[styles.container]} source={images.backgroundx}> 
        <View style={styles.container}>
          <Header backgroundColor="transparent" outerContainerStyles={{borderBottomWidth:0}} >
            {this.renderLeftHeader()}
          </Header>
          <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>this.onPress(-1)}>
                <Image source={images.ic_plus_down} style={{width:sizeImageCenter/2 ,height:sizeImageCenter/2}} />
              </TouchableOpacity>
              
              <ImageBackground style={[styles.containerCenter,{width:sizeImageCenter,height:sizeImageCenter,marginHorizontal:moderateScale(40)}]} source={images.image_velocity} >
                <Text style={[TextStyle.xxxExtraText,{color:'white',fontWeight:'bold'}]}>{valueRound}</Text>
                <Text style={[TextStyle.xExtraText,{color:'white',fontWeight: '600',opacity: 0.8}]}>{`${valueRound>1?'rounds':'round'}`}</Text>
              </ImageBackground>
              <TouchableOpacity onPress={()=>this.onPress(1)}>
                <Image source={images.ic_plus_up} style={{width:sizeImageCenter/2 ,height:sizeImageCenter/2}}/>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                TextStyle.mediumText,
                {
                  marginTop:20,
                  color: 'white',
                  fontWeight:'bold',
                  textAlignVertical: 'center',
                  alignSelf:'center'
                }
              ]}
            >
            {`~${sumMiles} ${sumMiles>1?'miles':'mile'}`}
            </Text>
          </View>
          <View style={styles.containerBottom}>
            <Button
              loading={isLoading}
              title="Next"
              textStyle={[TextStyle.mediumText,{fontWeight:'bold',color:'white'}]}
              buttonStyle={[styles.button , {marginBottom:40}]}
              onPress={this.onPressCreateRoom}
            />
          </View>
          {this.initDialogInvite()}
        </View>
        </ImageBackground>
    );
  }
}

ChooseRoundScreen.propTypes = {};

ChooseRoundScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser }
)(ChooseRoundScreen);