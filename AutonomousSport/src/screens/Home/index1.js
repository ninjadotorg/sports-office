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
////
// import { TAG as TAGPROFILE } from '@/screens/Profile';
//////
// import { TAG as TAGTOPRACE } from '@/screens/TopRace';
// import { TAG as TAG_REVIEW_SENSOR } from '@/screens/ReviewSensor';
import { GameLoop } from 'react-native-game-engine';
import images from '@/assets';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import DashboardProfile from '@/components/DashboardProfile';
import { connect } from 'react-redux';
import _, { debounce } from 'lodash';
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
// import * as Animatable from 'react-native-animatable';
import styles from './styles';

export const TAG = 'HomeScreen';
// const sizeImageCenter = verticalScale(130);
class HomeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  render() {
    return <View style={styles.container} />;
  }
}

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};
export default connect(
  state => ({}),
  {}
)(HomeScreen);
