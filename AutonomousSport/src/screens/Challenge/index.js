import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';

import { Button } from 'react-native-elements';
import styles,{sizeIconRacing} from './styles';
import BikerProfile from '@/components/BikerProfile';
import Room from '@/models/Room';
import images, { icons } from '@/assets';
import { TAG as TAGHOME } from '@/screens/Home';
import { connect } from 'react-redux';
import { fetchUser, updateRacing } from '@/actions/UserAction';
import { leftRoom } from '@/actions/RoomAction';
import { connectAndPrepare, disconnectBluetooth } from '@/actions/RaceAction';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import firebase from 'react-native-firebase';
import _, { debounce } from 'lodash';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import ImageZoom from 'react-native-image-pan-zoom';


const listPoint = [
  '1309,837',
  '1265,843',
  '1224,843',
  '1183,840',
  '1155,843',
  '1114,840',
  '1076,840',
  '1035,840',
  '1004,840',
  '975,843',
  '931,843',
  '897,846',
  '862,840',
  '821,846',
  '786,849',
  '755,849',
  '727,849',
  '705,856',
  '670,862',
  '638,868',
  '601,865',
  '572,856',
  '544,852',
  '519,846',
  '491,840',
  '459,843',
  '409,840',
  '377,843',
  '352,846',
  '311,846',
  '273,843',
  '248,830',
  '217,818',
  '201,799',
  '179,774',
  '169,742',
  '166,705',
  '166,673',
  '163,648',
  '163,626',
  '166,598',
  '166,563',
  '166,525',
  '163,497',
  '163,468',
  '160,450',
  '147,431',
  '129,406',
  '113,380',
  '107,355',
  '103,330',
  '116,308',
  '144,289',
  '179,289',
  '198,295',
  '210,308',
  '223,330',
  '232,352',
  '242,377',
  '251,409',
  '283,421',
  '327,431',
  '365,431',
  '402,431',
  '440,431',
  '475,437',
  '513,434',
  '557,434',
  '591,431',
  '635,431',
  '679,434',
  '723,428',
  '761,424',
  '802,424',
  '821,424',
  '843,440',
  '865,456',
  '906,459',
  '963,462',
  '1000,462',
  '1038,465',
  '1089,462',
  '1123,465',
  '1158,462',
  '1189,456',
  '1230,443',
  '1259,431',
  '1306,428',
  '1359,428',
  '1416,424',
  '1473,428',
  '1510,428',
  '1542,424',
  '1570,421',
  '1595,421',
  '1614,424',
  '1636,428',
  '1655,443',
  '1671,462',
  '1693,481',
  '1709,491',
  '1731,497',
  '1768,500',
  '1784,516',
  '1794,535',
  '1800,553',
  '1803,591',
  '1806,635',
  '1806,657',
  '1803,683',
  '1803,711',
  '1803,736',
  '1797,777',
  '1790,808',
  '1772,824',
  '1737,843',
  '1709,846',
  '1652,852',
  '1605,846',
  '1564,849',
  '1529,849',
  '1491,846',
  '1460,840',
  '1416,843',
  '1391,840',
  '1362,843',
  '1331,843'
];

export const TAG = 'ChallengeScreen';
const heightMap = screenSize.height;
class ChallengeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    const room: Room = new Room(props.navigation?.state.params);
    const { width = 0, height = 1 } = Image.resolveAssetSource(images.map);
    this.ratios = width / height || 1;
    this.scaleSize = heightMap / height;
    const pointStart = this.getCurrentPoint();
    
    this.state = {
      room: room,
      user: {},
      pos: {
        y: pointStart.y,
        x: pointStart.x
      },
      currentPositionIndex: 0,
      race: {},
      distanceRun: 0,
      kcal: 0,
      isLoading: false,
      isReady: false
    };
    
    this.pathKey = `games/race-rooms/${room?.session || ''}`;
    this.dataPrefference = firebase.database().ref(this.pathKey);
  }

  getCurrentPoint = (currentPositionIndex = 0) => {
    let x,y = 0;
    try {
      const pointStart: [] = listPoint[currentPositionIndex].split(',');
      console.log(TAG, ' getCurrentPoint - nextPoint = ', pointStart);
      // x = (Number(pointStart[0])-sizeIconRacing.width/2) * this.scaleSize;
      // y = (Number(pointStart[1])-sizeIconRacing.height/2) * this.scaleSize;
      x = (Number(pointStart[0])) * this.scaleSize -sizeIconRacing.width/2;
      y = (Number(pointStart[1])) * this.scaleSize -sizeIconRacing.height/2;
    } catch (error) {
      
    }
    return {
      x,y
    }; 
    
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      user,
      race,
      distanceRun = 0,
      room = {},
      pos,
      isReady,
      currentPositionIndex,
      kcal = 0
    } = this.state;

    if (!_.isEqual(nextProps?.user, user)) {
      
      this.setState(
        {
          user: nextProps.user,
          isLoading: false
        },
        () => {
          if (_.isEmpty(race) || race.state !== STATE_BLUETOOTH.CONNECTED) {
            console.log(TAG, ' componentWillReceiveProps - user = ', nextProps?.user);
            this.roomDataPrefference = this.dataPrefference
              .child('players')
              .child(this.state.user.fbuid);
            this.props.connectAndPrepare();
          }
        }
      );
    } else if (JSON.stringify(nextProps?.race) !== JSON.stringify(race)) {
      console.log(TAG, ' componentWillReceiveProps race begin ');
      const { race = {} } = nextProps;
      const { data } = race;
      console.log(TAG, ' componentWillReceiveProps race begin01 data = ', data);
      if (isReady && this.roomDataPrefference) {
        const s = distanceRun + data.distanceStreet || 0;
        const sumKcal = kcal + data.kcal || 0;
        // caculate goal
        const goal = Math.round((s * 100) / room?.miles) || 0;
        console.log(TAG, ' componentWillReceiveProps 01 - s = ', s);

        const indexPosition = Math.floor((listPoint.length * goal) / 100);

        const nextPoint = this.getCurrentPoint(indexPosition);
        this.setState({
          race: race,
          currentPositionIndex: indexPosition,
          distanceRun: s,
          kcal: sumKcal,
          pos: {
            x: nextPoint.x,
            y: nextPoint.y
          }
        });

        console.log(
          TAG,
          ' componentWillReceiveProps02 - goal = ',
          goal,
          ' - indexPosition = ',
          indexPosition,' sumKcal = ',sumKcal
        );
        this.roomDataPrefference.update({
          speed: data.speed,
          goal: goal,
          kcal: sumKcal
        });

        // save local user
        this.saveUserInfo({ kcal: data.kcal || 0, miles: data.distanceStreet });
      }
    }
  }

  saveUserInfo = debounce(({ kcal = 0, miles = 0 }) => {
    console.log(TAG, ' saveUserInfo begin ');

    this.props.updateRacing({ kcal, miles });
  }, 1000);

  // componentDidUpdate(prevProps, prevState) {
  //   if (JSON.stringify(prevProps?.user) !== JSON.stringify(this.state.user)) {
  //     console.log(TAG, ' componentDidUpdate - user = ', prevProps?.user);
  //     this.roomDataPrefference = this.dataPrefference.child('players').child(this.state.user.fbuid);
  //     this.props.connectAndPrepare();
  //   }else if (JSON.stringify(prevProps?.race) !== JSON.stringify(this.state.race)) {
  //      // caculate with value
  //      const {race,isReady} = this.state;
  //      const {data = {speed :0}} = race;
  //      if(isReady && this.roomDataPrefference){
  //       this.roomDataPrefference.update({
  //         speed:data.speed
  //       });
  //      }

  //      console.log(TAG, ' componentDidUpdate - data = ',data);

  //   }

  // }

  componentDidMount() {
    this.props.getUser();
  }

  renderMap = () => {
    const { room, isReady } = this.state;
    const uriPhoto = images.map || { uri: room?.photo || '' };
    const t = heightMap * this.ratios;
    return (
      <View style={styles.map}>
        <ImageZoom 
          cropWidth={t}
          cropHeight={heightMap}
          imageWidth={t}
          minScale={1}
          maxScale={2}
          imageHeight={heightMap}>
            <ImageBackground
              style={{ width: t, height: heightMap }}
              resizeMode="contain"
              source={uriPhoto}>
                {this.renderMarker()}
            </ImageBackground>
        </ImageZoom>
        

        {isReady ? null : (
          <Button
            containerViewStyle={{
              position: 'absolute',
              width: 300,
              bottom: 10
            }}
            title="Get ready"
            onPress={this.onPressReady}
            buttonStyle={[styles.button, { backgroundColor: '#02BB4F' }]}
            textStyle={[TextStyle.mediumText, { fontWeight: 'bold' }]}
          />
        )}
      </View>
    );
  };

  renderMarker = () => {
    const { pos } = this.state;
    return icons.close({
      color: 'red',
      size: sizeIconRacing.width,
      iconStyle:{
        margin:0
      },
      containerStyle: {
        paddingVertical:0,
        paddingHorizontal:0,
        width: sizeIconRacing.width,
        height: sizeIconRacing.height,
        position: 'absolute',
        top: pos.y ,
        left: pos.x
      }
    });
  };

  onPressReady = this.onClickView(() => {
    this.setState({ isReady: true });
  });

  componentWillUnmount() {
    console.log(TAG, ' componentWillUnmount ok');
    // this.props.disconnectBluetooth();
  }

  onPressClose = this.onClickView(async () => {
    const { room } = this.state;
    this.props.leftRoom({ session: room?.session });
    this.replaceScreen(this.props.navigation, TAGHOME);
  });

  render() {
    const { room, user } = this.state;
    return (
      <View style={styles.container}>
        {this.renderMap()}
        <View style={{ alignItems: 'center' }}>
          <BikerProfile room={room} user={user} />
        </View>

        {icons.close({
          onPress: this.onPressClose,
          containerStyle: {
            position: 'absolute',
            top: 10,
            left: 10
          }
        })}
      </View>
    );
  }
}

ChallengeScreen.propTypes = {};

ChallengeScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user?.userInfo,
    closeRoom: state.room?.closeRoom,
    race: state.race
  }),
  {
    getUser: fetchUser,
    updateRacing,
    connectAndPrepare,
    leftRoom,
    disconnectBluetooth
  }
)(ChallengeScreen);
