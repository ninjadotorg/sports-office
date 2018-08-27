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
    console.log(TAG," contructor mile = ", mile);
    this.state = {
      valueRound:0,
      mile:mile
    };
  }

  componentDidMount() {
    this.props.getUser();
  }

  onPressCreateRoom = async () => {
    try {
      const roomInfo = await ApiService.createRoom();
      console.log(TAG,' onPressCreateRoom roomInFo ' , roomInfo);
      if (roomInfo) {
        this.props.navigation.navigate(TAGCHALLENGE, roomInfo.toJSON());
      }
    } catch (error) {}
  };
  
  onPressBack = ()=>{
    this.props.navigation.goBack();
  }
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
    return (
      <View style={styles.topBar}>
        {icons.back({
          containerStyle: { marginHorizontal: 0 },
          onPress: this.onPressBack
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
      </View>
    );
  };
  onPress = (direct)=>{
    let {valueRound} = this.state;
    valueRound = valueRound + (direct*1);
    this.setState({
      valueRound:valueRound<0?0:(valueRound>10?10:valueRound)
    });
  }
  render() {
    const {valueRound,mile=0} = this.state;
    const sum = mile* valueRound;
    return (
      <View style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>this.onPress(-1)}>
              <Image source={images.ic_plus_down} />
            </TouchableOpacity>
            <View style={[styles.containerCenter,{minWidth:sizeImageCenter,minHeight:sizeImageCenter,marginHorizontal:moderateScale(30)}]}>
              <Image source={images.image_velocity} style={{position:'absolute',width:sizeImageCenter,height:sizeImageCenter}} />
              <Text style={[TextStyle.xxExtraText,{color:'white',fontWeight:'bold'}]}>{valueRound}</Text>
              <Text style={[TextStyle.mediumText,{color:'white'}]}>{`${valueRound>1?'rounds':'round'}`}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.onPress(1)}>
              <Image source={images.ic_plus_up}/>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              TextStyle.mediumText,
              {
                marginTop:10,
                color: 'white',
                fontWeight:'bold',
                textAlignVertical: 'center',
                alignSelf:'center'
              }
            ]}
          >
          {`~${sum} ${sum>1?'miles':'mile'}`}
          </Text>
        </View>
        <View style={styles.containerBottom}>
          <Button
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