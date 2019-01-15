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
import { TAG as TAG_REVIEW_SENSOR } from '@/screens/ReviewSensor';
import LinearGradient from 'react-native-linear-gradient';
import images, { colors } from '@/assets';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import DateTimePicker from '@/components/DateTimePicker';
import { connect } from 'react-redux';
import _, { debounce } from 'lodash';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  STATE_BLUETOOTH,
  CONSTANT_PRACTISE_MESSAGE,
  BUILD_MODE
} from '@/utils/Constants';
import {
  fetchUser,
  resetRacing,
  updateRacing,
  updatePractiseRacing,
  loginWithFirebase
} from '@/actions/UserAction';
import * as Animatable from 'react-native-animatable';
import styles, { sizeCircle } from './styles';

export const TAG = 'PracticeScreen';

class PracticeScreen extends BaseScreen {
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
      countDown: 0,
      value: 0
    };
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

  onPressCreateRoom = this.onClickView(async () => {
    this.props.navigation.navigate(TAGCREATE);
  });

  onPressReset = this.onClickView(async () => {
    const { isStarted } = this.state;
    if (isStarted) {
      this.setState(
        {
          race: {},
          distanceRun: 0,
          // speed: 0,
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
  onPressBluetooth = this.onClickView(() => {
    const { sensorInfo = {} } = this.state.race;
    if (BUILD_MODE.isDebugBuildType && sensorInfo && sensorInfo.peripheral) {
      this.showToastMessage(sensorInfo?.peripheral);
    }
    this.props.navigation.navigate(TAG_REVIEW_SENSOR, sensorInfo);
  });

  renderBluetoothStatus = () => {
    const status = this.state.race.state || STATE_BLUETOOTH.UNKNOWN;
    const img =
      status === STATE_BLUETOOTH.CONNECTED
        ? images.ic_status_bluetooth_on
        : images.ic_status_bluetooth_off;
    return (
      <TouchableOpacity onPress={this.onPressBluetooth}>
        <Image
          source={img}
          style={{ width: scale(30), height: scale(30), marginLeft: 40 }}
        />
      </TouchableOpacity>
    );
  };

  set setSpeed(newSpeed = {}) {
    this.speed = {
      ...this.speed,
      ...newSpeed
    };
  }
  updateHandler = ({ touches, screen, time }) => {
    const valueChange = this.speed.value - this.speed.countDown;
    if (Math.round(valueChange) != 0) {
      const tempValue =
        (valueChange * (time.delta > 1000 ? 0 : time.delta)) / 1000;
      // console.log(TAG,' updateHandler time = ',time,' valueChange = ',valueChange);
      // const speedCountDown = Math.abs(valueChange) <= this.speed.value ? this.speed.countDown + tempValue : this.speed.value;
      const speedCountDown = this.speed.countDown + tempValue;
      // this.speed.countDown =  speedCountDown < 0 ? this.speed.value :  speedCountDown;
      this.speed.countDown = speedCountDown;
      console.log(
        TAG,
        ' updateHandler speedCountDown = ',
        speedCountDown,
        ' speed = ',
        this.state.speed,
        ', value = ',
        this.speed.value
      );
    }
    const nextSpeed = Math.round(this.speed.countDown);
    if (
      nextSpeed != Math.round(this.state.speed) &&
      this.speed.countDown >= 0
    ) {
      console.log(TAG, ' updateHandler 01 ');

      this.triggerVoiceWithSpeed(this.state.speed, nextSpeed);
      this.setState({
        speed: nextSpeed
      });
    }
  };

  triggerVoiceWithSpeed = (previousSpeed = 0, nextSpeed = 0) => {
    // implement here
    if (previousSpeed < nextSpeed) {
      this.readText(CONSTANT_PRACTISE_MESSAGE.PASS_A_SPEED(nextSpeed));
    }
  };
  triggerVoiceWithDistance = (previous = 0, next = 0) => {
    // implement here
    previous = Math.floor(previous);
    next = Math.floor(next);
    if (previous < next) {
      this.readText(CONSTANT_PRACTISE_MESSAGE.REACH_A_DISTANCE(next));
    }
  };
  triggerVoiceWithEnergy = (previous = 0, next = 0) => {
    // implement here
    previous = Math.floor(previous);
    next = Math.floor(next);
    if (previous < next) {
      this.readText(CONSTANT_PRACTISE_MESSAGE.REACH_A_ENERGY(next));
    }
  };
  triggerVoiceWithStart = (previous = 0, next = 0) => {
    // implement here
    if (previous === 0 && previous < next) {
      this.readText(CONSTANT_PRACTISE_MESSAGE.START_RACING());
    }
  };
  render() {
    const { user, speed, isStarted } = this.state;

    const { userInfo = {}, practiceInfo = {} } = user || {};
    return (
      <LinearGradient
        colors={['white', 'white', '#f7f7f7']}
        style={styles.container}
      >
        <View style={[styles.containerTop, {}]}>
          <DateTimePicker />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'white'
          }}
        >
          <AnimatedCircularProgress
            size={sizeCircle}
            rotation={0}
            width={5}
            fill={70}
            tintColor={colors.main_red}
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="rgba(246,246,246,0.3)"
          >
            {fill => (
              <View
                style={{
                  backgroundColor: 'rgba(246,246,246,0.3)',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <View
                  style={{
                    padding: 10,
                    backgroundColor: 'transparent',
                    flex: 1,
                    justifyContent: 'space-around'
                  }}
                >
                  <Text
                    style={[
                      TextStyle.normalText,
                      {
                        color: colors.text_main_black,
                        textAlign: 'center',
                        opacity: 0.4
                      }
                    ]}
                  >
                    Goal
                  </Text>
                  <Text
                    style={[
                      TextStyle.mediumText,
                      {
                        color: colors.text_main_black,
                        fontWeight: '500',
                        textAlign: 'center'
                      }
                    ]}
                  >
                    300mi
                  </Text>
                </View>
                <Text
                  style={[
                    TextStyle.xxxExtraText,
                    {
                      color: colors.text_main_black,
                      fontWeight: '500',
                      textAlign: 'center'
                    }
                  ]}
                >
                  259
                </Text>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent'
                  }}
                >
                  <Text
                    style={[
                      TextStyle.normalText,
                      {
                        color: colors.text_main_black,
                        fontWeight: '500',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                      }
                    ]}
                  >
                    {'mi this week'.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
        <View style={[styles.containerBottom, {}]}>
          <View>
            <Text style={[TextStyle.normalText, styles.textBottomItemTop]}>
              Miles
            </Text>
            <Text style={[TextStyle.mediumText, styles.textBottomItemBottom]}>
              8.2
            </Text>
          </View>
          <View>
            <Text style={[TextStyle.normalText, styles.textBottomItemTop]}>
              Categories
            </Text>
            <Text style={[TextStyle.mediumText, styles.textBottomItemBottom]}>
              32231
            </Text>
          </View>
          <View>
            <Text style={[TextStyle.normalText, styles.textBottomItemTop]}>
              Steps
            </Text>
            <Text style={[TextStyle.mediumText, styles.textBottomItemBottom]}>
              887
            </Text>
          </View>
        </View>
        {this.renderToastMessage()}
        {this.initDialogInvite()}
      </LinearGradient>
    );
  }
}

PracticeScreen.propTypes = {};

PracticeScreen.defaultProps = {};
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
)(PracticeScreen);
