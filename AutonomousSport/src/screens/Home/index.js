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
import TextStyle, { screenSize } from '@/utils/TextStyle';
import { TAG as TAGCREATE } from '@/screens/Create';
import { TAG as TAGFRIENDS } from '@/screens/Friends';
import { TAG as TAGPROFILE } from '@/screens/Profile';
import { TAG as TAGTOPRACE } from '@/screens/TopRace';
import { GameLoop } from 'react-native-game-engine';

import images from '@/assets';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import DashboardProfile from '@/components/DashboardProfile';
import { connect } from 'react-redux';
import _, { debounce } from 'lodash';
import PopupDialog from 'react-native-popup-dialog';
import { STATE_BLUETOOTH, CONSTANT_MESSAGE } from '@/utils/Constants';
import {
  fetchUser,
  resetRacing,
  updateRacing,
  updatePractiseRacing,
  loginWithFirebase
} from '@/actions/UserAction';
import * as Animatable from 'react-native-animatable';
import styles, { sliderWidth, itemWidth } from './styles';

export const TAG = 'HomeScreen';
const sizeImageCenter = verticalScale(130);
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

    this.speed = {
      countDown:0,
      value:0
    };

  }

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
    super.componentDidMount();
    this.props.getUser();
    // this.showDialogInvite(true);
    this.onPressReset();
  }

  // componentWillUnmount() {
  //   console.log(TAG, ' componentWillUnmount ok----');
  //   this.props.disconnectBluetooth();

  // }

  onPressCreateRoom = this.onClickView(async () => {
    this.props.navigation.navigate(TAGCREATE);
    // const index = Util.getRandomInt(0,CONSTANT_MESSAGE.START_RACING.length-1);
    // const s = CONSTANT_MESSAGE.START_RACING[index];
    // console.log(TAG, ' onPressCreateRoom message = ',s);
    // this.readText(s);
  });

  onPressReset = this.onClickView(async () => {
    const { isStarted } = this.state;
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
  onPressLeaderBoard = this.onClickView(() => {
    this.props.navigation.navigate(TAGTOPRACE);
  });

  renderBluetoothStatus = () => {
    const status = this.state.race.state || STATE_BLUETOOTH.UNKNOWN;
    const img =
      status === STATE_BLUETOOTH.CONNECTED
        ? images.ic_status_bluetooth_on
        : images.ic_status_bluetooth_off;
    return (
      <TouchableOpacity>
        <Image
          source={img}
          style={{ width: scale(30), height: scale(30), marginLeft: 40 }}
        />
      </TouchableOpacity>
    );
  };
  updateHandler = ({ touches, screen, time }) => {
    
    if (Math.round(this.speedCountDown) != this.state.speed) {
      const valueChange = this.state.speed <= 0 ? (0) : this.state.speed;
      const tempValue = ((valueChange - this.speedCountDown) * time.delta) / 1000;
      const speedCountDown = this.speedCountDown + tempValue;
    
      this.speedCountDown = speedCountDown;
      console.log(TAG,' updateHandler valueChange = ',valueChange,' speedCountDown = ',Math.ceil(speedCountDown),' tempValue = ',tempValue);
      this.setState({
        speedCountDown: Math.round(speedCountDown)
      });
    }
  };
  render() {
    const { user, speed, speedCountDown = 0, isStarted } = this.state;

    const { userInfo = {}, practiceInfo = {} } = user || {};
    return (
      <ImageBackground style={styles.container} source={images.backgroundx}>
        <View style={[styles.containerTop, styles.containerRowTop, {}]}>
          <View
            style={[
              styles.itemTop,
              { flexDirection: 'row', alignItems: 'flex-start' }
            ]}
          >
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
          <View style={[styles.itemTop, {}]}>
            <DashboardProfile
              kcal={311}
              mile={12}
              // kcal={Math.round((practiceInfo?.kcal || 0) * 100) / 100}
              // mile={Math.round((practiceInfo?.miles || 0) * 1000) / 1000}
            />
          </View>
          <View
            style={[
              styles.itemTop,
              { flexDirection: 'row', alignItems: 'flex-end' }
            ]}
          >
            <TouchableOpacity onPress={this.onPressLeaderBoard}>
              <Image
                source={images.ic_leader_board}
                style={{ width: scale(30), height: scale(30) }}
              />
            </TouchableOpacity>

            {this.renderBluetoothStatus()}
          </View>
        </View>
        <GameLoop
          style={[styles.containerCenter, {}]}
          onUpdate={this.updateHandler}
        >
          <Animatable.Image
            animation="pulse"
            easing="ease-out"
            iterationCount={1}
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
              { color: 'white', fontWeight: 'bold' }
            ]}
          >
            {Math.ceil(speedCountDown)}
          </Text>
          <Text
            style={[
              TextStyle.xExtraText,
              {
                color: 'white',
                fontWeight: 'bold',
                opacity: 0.8
              }
            ]}
          >
            mi/h
          </Text>
        </GameLoop>

        <View style={styles.containerBottom}>
          <Button
            title={isStarted ? 'Reset' : 'Practice'}
            textStyle={[
              TextStyle.mediumText,
              { fontWeight: 'bold', color: '#ffc500' }
            ]}
            buttonStyle={[styles.button]}
            onPress={this.onPressReset}
          />
          <Button
            title="Start Racing"
            buttonStyle={[
              styles.button,
              {
                minWidth: scale(90),
                paddingHorizontal: scale(15),
                backgroundColor: '#ffc500',
                borderWidth: 0
              }
            ]}
            textStyle={[
              TextStyle.mediumText,
              { fontWeight: 'bold', color: '#534c5f' }
            ]}
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
