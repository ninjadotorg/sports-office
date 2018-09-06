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

import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCREATE} from '@/screens/Create';
import { TAG as TAGFRIENDS } from '@/screens/Friends';
import { TAG as TAGPROFILE } from '@/screens/Profile';
import images from '@/assets';
import { moderateScale,scale } from 'react-native-size-matters';
import DashboardProfile from '@/components/DashboardProfile';
import { connect } from 'react-redux';
import { fetchUser} from '@/actions/UserAction';

export const TAG = 'HomeScreen';
const sizeImageCenter = moderateScale(130);
class HomeScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Home'
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user
      };
    }
    return null;
  }
  componentDidMount() {}

  onPressCreateRoom = async () => {
    this.props.navigation.navigate(TAGCREATE);
    // try {
    //   const roomInfo:Room = await ApiService.createRoom();
    //   console.log(TAG, ' onPressCreateRoom roomInFo ', roomInfo);
    //   if (roomInfo) {
    //     this.props.navigation.navigate(TAGCREATE, roomInfo.toJSON());
    //   }
    // } catch (error) {}
  };

  onPressListFriends = ()=>{
    this.props.navigation.navigate(TAGFRIENDS);
  }

  onPressProfile = ()=>{
    this.props.navigation.navigate(TAGPROFILE);
  }

  render() {
    const { user,isLoading } = this.state;
    const {userInfo = {}} = user ||{};
    return (
      <ImageBackground style={styles.container} source={images.image_start}>
        <View style={styles.containerTop} >
        
          <View style={{flexDirection:'row',alignItems:'flex-start'}}>
            <TouchableOpacity onPress={this.onPressProfile}>
              <Image source={images.user} style={{width:scale(30),height:scale(30)}}/>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={this.onPressListFriends}>
              <Image source={images.user} style={{width:scale(30),height:scale(30),marginLeft:10}}/>
            </TouchableOpacity>
          </View>
          <View>
            <DashboardProfile kcal={userInfo?.profile?.kcal||0} mile={userInfo?.profile?.miles||0}/>
          </View>
        </View>
        <View style={styles.containerCenter}>
          <Image source={images.image_velocity} style={{position:'absolute',width:sizeImageCenter,height:sizeImageCenter}} />
          <Text style={[TextStyle.xxExtraText,{color:'white',fontWeight:'bold'}]}>0</Text>
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

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser}
)(HomeScreen);