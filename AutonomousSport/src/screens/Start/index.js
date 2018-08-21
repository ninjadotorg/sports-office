import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { TAG as TAGFRIENDS } from '@/screens/Friends';
import images from '@/assets';
import { moderateScale,scale } from 'react-native-size-matters';
import ViewUtil from '@/utils/ViewUtil';

export const TAG = 'StartScreen';
const sizeImageCenter = moderateScale(100);
export default class StartScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Start'
    };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onPressCreateRoom = async () => {
    try {
      const roomInfo = await ApiService.createRoom();
      console.log(TAG, ' onPressCreateRoom roomInFo ', roomInfo);
      if (roomInfo) {
        this.props.navigation.navigate(TAGCHALLENGE, roomInfo.toJSON());
      }
    } catch (error) {}
  };

  onPressListFriends = ()=>{
    this.props.navigation.navigate(TAGFRIENDS);
  }

  render() {
    return (
      <ImageBackground style={styles.container} source={images.image_start}>
        <View style={styles.containerTop} >
          <View style={{flexDirection:'row',alignItems:'flex-start'}}>
            <Image source={images.user} style={{width:scale(30),height:scale(30)}}/>
            <TouchableOpacity onPress={this.onPressListFriends}>
              <Image source={images.user} style={{width:scale(30),height:scale(30),marginLeft:10}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.containerTopRight}>
            <View style={styles.topRightItem}>
              <Text style={[TextStyle.bigText,{color:'white',textAlign:'center',fontWeight:'bold'}]}>145</Text>
              <Text style={[TextStyle.mediumText,{color:'white',textAlign:'center'}]}>Kcal</Text>
            </View>
            <View>
              {ViewUtil.line({styleContainer:{flexDirection: 'row',width:1}})}
            </View>
            <View style={styles.topRightItem}>
              <Text style={[TextStyle.bigText,{color:'white',textAlign:'center',fontWeight:'bold'}]}>1.4</Text>
              <Text style={[TextStyle.mediumText,{color:'white',textAlign:'center'}]}>Miles</Text>
            </View>
          </View>
        </View>
        <View style={styles.containerCenter}>
          <Image source={images.image_velocity} style={{position:'absolute',width:sizeImageCenter,height:sizeImageCenter}} />
          <Text style={[TextStyle.xxExtraText,{color:'white',fontWeight:'bold'}]}>12</Text>
          <Text style={[TextStyle.mediumText,{color:'white'}]}>km/h</Text>
        </View>
        <View style={styles.containerBottom}>
          <Button
            title="Reset"
            textStyle={[TextStyle.mediumText,{fontWeight:'bold',color:'#02BB4F'}]}
            buttonStyle={[styles.button]}
            onPress={this.onPressCreateRoom}
          />
          <Button
            title="Start Racing"
            buttonStyle={[styles.button,{backgroundColor:'#02BB4F'}]}
            textStyle={[TextStyle.mediumText,{fontWeight:'bold'}]}
            onPress={this.onPressCreateRoom}
          />
        </View>
      </ImageBackground>
    );
  }
}

StartScreen.propTypes = {};

StartScreen.defaultProps = {};
