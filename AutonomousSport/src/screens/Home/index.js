import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Button } from 'react-native-elements';
import { connectAndPrepare, disconnectBluetooth } from '@/actions/RaceAction';
import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import { TAG as TAGCREATE } from '@/screens/Create';
import { TAG as TAGFRIENDS } from '@/screens/Friends';
import { TAG as TAGPROFILE } from '@/screens/Profile';
import images from '@/assets';
import { moderateScale, scale } from 'react-native-size-matters';
import DashboardProfile from '@/components/DashboardProfile';
import { connect } from 'react-redux';
import _, { debounce } from 'lodash';
import PopupDialog from 'react-native-popup-dialog';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import {
  fetchUser,
  resetRacing,
  updateRacing,
  updatePractiseRacing,
  loginWithFirebase
} from '@/actions/UserAction';

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
      race: {},
      distanceRun: 0,
      kcal: 0,
      isStarted: true,
      speed: 0,
      isLoading: false
    };
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
  //     console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
  //     return {
  //       user: nextProps.user
  //     };
  //   }else if (JSON.stringify(nextProps?.race) !== JSON.stringify(prevState.race)) {
  //     // caculate with value
  //     const {race,kcal,distanceRun } = prevState;
  //     const {data = {speed :0}} = race;
  //     const s = (distanceRun + data.distanceStreet)||0;
  //      const sumKcal = (kcal + data.kcal)||0;
  //      console.log(TAG, ' getDerivedStateFromProps 01 - s = ', s);
  //      return {
  //        race: race,
  //        distanceRun:s,
  //        kcal:sumKcal
  //      };
  //   }
  //   return null;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(TAG, ' componentDidUpdate - begin------ ');
  //   if (JSON.stringify(prevState?.user) !== JSON.stringify(this.state.user)) {
  //     console.log(TAG, ' componentDidUpdate - user = ', prevProps?.user);
  //     this.props.connectAndPrepare();
  //   }else if (JSON.stringify(prevProps?.race) !== JSON.stringify(this.state.race)) {

  //      console.log(TAG, ' componentDidUpdate01 - data = ',prevProps?.race);
  //   }

  // }

  componentWillReceiveProps(nextProps) {
    const { user, race, distanceRun = 0, kcal = 0, isStarted } = this.state;
    console.log(TAG, ' componentWillReceiveProps - begin ');
    if (
      _.isEmpty(user) &&
      JSON.stringify(nextProps?.user) !== JSON.stringify(user)
    ) {
      console.log(TAG, ' componentWillReceiveProps - user = ', nextProps?.user);
      this.setState(
        {
          user: nextProps.user,
          isLoading: false,
          race: nextProps.race
        },
        () => {
          const { race } = this.state;
          if (_.isEmpty(race) || race.state !== STATE_BLUETOOTH.CONNECTED) {
            console.log(TAG, ' componentWillReceiveProps - user1111');
            this.props.connectAndPrepare();
          }
        }
      );
    } else if (
      isStarted &&
      JSON.stringify(nextProps?.race) !== JSON.stringify(this.state.race)
    ) {
      console.log(TAG, ' componentWillReceiveProps race begin ');
      const { race = {} } = nextProps;
      const {
        data,
        isSavedDevice = false,
        state = STATE_BLUETOOTH.UNKNOW
      } = race;
      console.log(TAG, ' componentWillReceiveProps race begin01 data = ', data);
      if (isSavedDevice && state === STATE_BLUETOOTH.CONNECTED) {
        const s = distanceRun + data.distanceStreet || 0;
        const sumKcal = kcal + data.kcal || 0;
        console.log(TAG, ' componentWillReceiveProps 01 - s = ', s);
        this.setState({
          user: nextProps.user,
          race: race,
          distanceRun: s,
          speed: data.speed || 0,
          kcal: sumKcal
        });
        // save local user
        this.saveUserInfo({ kcal: data.kcal || 0, miles: data.distanceStreet });
      }
      console.log(TAG, ' componentWillReceiveProps - end');
    }
  }

  saveUserInfo = debounce(({ kcal = 0, miles = 0 }) => {
    console.log(TAG, ' saveUserInfo begin ');
    this.props.updateRacing({ kcal, miles });
    this.props.updatePractiseRacing({ kcal, miles });
  }, 1000);

  componentDidMount() {
    this.props.getUser();
    //this.showDialogInvite(true);
    this.onPressReset();
  }

  // componentWillUnmount() {
  //   console.log(TAG, ' componentWillUnmount ok----');
  //   this.props.disconnectBluetooth();

  // }

  onPressCreateRoom = this.onClickView(async () => {
    this.props.navigation.navigate(TAGCREATE);
  });

  onPressReset = this.onClickView(async () => {
    const { isStarted } = this.state;
    console.log(TAG, ' onPressReset isStarted = ', isStarted);
    if (isStarted) {
      this.setState(
        {
          race: {},
          distanceRun: 0,
          speed: 0,
          kcal: 0,
          isStarted: true
        },
        () => {
          this.props.resetRacing();
        }
      );
    } else {
      this.setState({
        isStarted: true
      });
    }
  });

  onPressListFriends = this.onClickView(() => {
    this.props.navigation.navigate(TAGFRIENDS);
  });

  onPressProfile = this.onClickView(() => {
    this.props.navigation.navigate(TAGPROFILE);
  });

  render() {
    const { user, speed, isStarted } = this.state;

    const { userInfo = {}, practiceInfo = {} } = user || {};
    return (
      <ImageBackground style={styles.container} source={images.backgroundx}>
        

        <View style={styles.containerCenter}>
          <Image
            source={images.image_velocity}
            style={{
              position: 'absolute',
              width: sizeImageCenter,
              height: sizeImageCenter
            }}
          />
          <Text
            style={[
              TextStyle.xxxExtraText,
              { color: 'white', fontWeight: 'bold' , }
            ]}
          >
            {Math.ceil(speed)}
          </Text>
          <Text style={[TextStyle.xExtraText, { color: 'white' ,fontWeight: '600', opacity: 0.8, marginTop:-10}]}>mi/h</Text>
        </View>
            

        <View style={[styles.containerTop , styles.containerRowTop, {position:'absolute'}]}>
          <View style={[ styles.itemTop, { flexDirection: 'row', alignItems: 'flex-start' }] }>
            <TouchableOpacity onPress={this.onPressProfile}>
              <Image
                source={images.user}
                style={{ width: scale(30), height: scale(30) }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onPressListFriends}>
              <Image
                source={images.user_friend}
                style={{ width: scale(30), height: scale(30), marginLeft: 40 }}
              />
            </TouchableOpacity>
          </View>
          <View style={[ styles.itemTop,  {alignItems: 'flex-end' , right:0} ]} >
            <DashboardProfile
              kcal={
                Math.round(
                  (practiceInfo?.kcal || 0) * 100
                ) / 100
              }
              mile={
                Math.round(
                  (practiceInfo?.miles || 0) * 1000
                ) / 1000
              }
            />
          </View>
        </View>

        <View style={styles.containerBottom}>
          <Button
            title={isStarted ? 'Reset' : 'Practice'}
            textStyle={[
              TextStyle.mediumText,
              { fontWeight: 'bold', color: '#02BB4F' }
            ]}
            buttonStyle={[styles.button]}
            onPress={this.onPressReset}
          />
          <Button
            title="Start Racing"
            buttonStyle={[styles.button, { backgroundColor: '#02BB4F' }]}
            textStyle={[TextStyle.mediumText, { fontWeight: 'bold' }]}
            onPress={this.onPressCreateRoom}
          />
        </View>
        {this.initDialogInvite()}
      </ImageBackground>
    );
  }
}

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user,
    race: state.race
  }),
  {
    getUser: fetchUser,
    loginWithFirebase,
    updatePractiseRacing,
    resetRacing,
    connectAndPrepare,
    disconnectBluetooth,
    updateRacing
  }
)(HomeScreen);
