import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import images, { icons } from '@/assets';
import { moderateScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import { fetchUser } from '@/actions/UserAction';

export const TAG = 'ChooseRoundScreen';


const sizeImageCenter = moderateScale(130);
class ChooseRoundScreen extends BaseScreen {
  constructor(props) {
    super(props);
    const mile = this.props.navigation.getParam('miles')||0;
    const mapId = this.props.navigation.getParam('id')||-1;
    console.log(TAG," contructor mile = ", mile);
    this.state = {
      valueRound:1,
      mile:mile,
      mapId:mapId,
      sumMiles:mile,
      error:'',
      isLoading:false
    };
  }

  componentDidMount() {
    this.props.getUser();
  }

  onPressCreateRoom = async () => {
    try {
      this.setState({
        isLoading:true
      });
      const {valueRound,mapId,sumMiles} = this.state;
      if(sumMiles>0){
      const roomInfo = await ApiService.createRoom({
        mapId,
        loop:valueRound,
        miles:sumMiles
      });
    
      console.log(TAG,' onPressCreateRoom roomInFo ' , roomInfo);
      if (roomInfo) {
        console.log(TAG,' onPressCreateRoom roomInFo ');
        this.replaceScreen(this.props.navigation,TAGCHALLENGE,roomInfo.toJSON());
        // this.props.navigation.replace(TAGCHALLENGE, roomInfo.toJSON());
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
  };
  
  onPressBack = ()=>{
    this.props.navigation.goBack();
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
          Number of rounds
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
    const {valueRound,mile=0,sumMiles = 0,isLoading = false} = this.state;
    
    return (
      <View style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>this.onPress(-1)}>
              <Image source={images.ic_plus_down} style={{width:sizeImageCenter/2 ,height:sizeImageCenter/2}} />
            </TouchableOpacity>
            <View style={[styles.containerCenter,{minWidth:sizeImageCenter,minHeight:sizeImageCenter,marginHorizontal:moderateScale(30)}]}>
              <Image source={images.image_velocity} style={{position:'absolute',width:sizeImageCenter,height:sizeImageCenter}} />
              <Text style={[TextStyle.xxExtraText,{color:'white',fontWeight:'bold'}]}>{valueRound}</Text>
              <Text style={[TextStyle.mediumText,{color:'white'}]}>{`${valueRound>1?'rounds':'round'}`}</Text>
            </View>
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
            textStyle={[TextStyle.mediumText,{fontWeight:'bold',color:'#02BB4F'}]}
            buttonStyle={[styles.button]}
            onPress={this.onPressCreateRoom}
          />
        </View>
      </View>
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