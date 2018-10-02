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
import styles,{sizeIconRacing,setMapInfo} from './styles';
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
import Player from '@/models/Player';
import Util from '@/utils/Util';

export const TAG = 'ChallengeScreen';
let heightMap = screenSize.height;
const colors = ['red','blue','yellow','green'];
class ChallengeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    const room: Room = new Room(props.navigation?.state.params);
    // const { width = 0, height = 1 } = Image.resolveAssetSource(images.map);
    const { width = 0, height = 1 } = room?.getMapSize()||{};
    const sizeMap = Util.calculateMapSize({widthReal:width,heightReal:height});
    this.ratios = sizeMap.ratios;
    this.scaleSize = sizeMap.scaleSize;
    this.listPoint = room.getPathOfMap();
    const pointStart = this.getCurrentPoint();
    this.widthMap = sizeMap.width;
    heightMap = sizeMap.height;
    this.state = {
      room: room,
      user: {},
      pos: {
        y: pointStart.y,
        x: pointStart.x
      },
      playersColor:{},
      players:[],
      currentPositionIndex: 0,
      race: {},
      distanceRun: 0,
      kcal: 0,
      isLoading: false,
      isReady: false
    };
    
    this.pathKey = `games/race-rooms/${room?.session || ''}`;
    this.dataPrefference = firebase.database().ref(this.pathKey);
    this.roomDataPrefference = this.dataPrefference.child('players');
  }

  onStreamCreated =(streamId)=>{
    const {user} = this.state;
    // push stream Id on firebase
    if(!_.isEmpty(streamId)&& !_.isEmpty(user)){
      this.dataPrefference.child('players')?.child(user.fbuid).update({streamId: streamId});
      this.onListenerChanel();
    }
  }
  onStreamDestroyed =(streamId)=>{
    this.roomDataPrefference?.off('value');
  }
  getCurrentPoint = (currentPositionIndex = 0) => {
    let x,y = 0;
    try {
      const pointStart: [] = this.listPoint[currentPositionIndex];
      console.log(TAG, ' getCurrentPoint - nextPoint = ', pointStart);
      x = (Number(pointStart[0])) * this.scaleSize -sizeIconRacing.width;
      y = (Number(pointStart[1])) * this.scaleSize -sizeIconRacing.height;
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
          isLoading: false,
          race:nextProps.race
        },
        () => {
          if (_.isEmpty(this.state.race) || race.state !== STATE_BLUETOOTH.CONNECTED) {
            console.log(TAG, ' componentWillReceiveProps - user = ', nextProps?.user);
            this.playerMeDataPrefference = this.dataPrefference
              .child('players')
              .child(this.state.user.fbuid);
            this.props.connectAndPrepare();
          }
        }
      );
    }
    if (JSON.stringify(nextProps?.race) !== JSON.stringify(this.state.race)) {
      console.log(TAG, ' componentWillReceiveProps race begin ');
      const { race = {} } = nextProps;
      const { data } = race;
      console.log(TAG, ' componentWillReceiveProps race begin01 data = ', data);
      if (isReady && this.playerMeDataPrefference) {
        const s = distanceRun + (data.distanceStreet || 0);
        const sumKcal = kcal + (data.kcal || 0);
        // caculate goal
        const goal = Math.round((s * 100) / room?.miles) || 0;
        console.log(TAG, ' componentWillReceiveProps 01 - s = ', s);

        const indexPosition = Math.floor((this.listPoint.length * goal) / 100);

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
        this.playerMeDataPrefference.update({
          speed: data.speed,
          goal: goal,
          kcal: sumKcal
        });

        // save local user
        this.saveUserInfo({ kcal: data.kcal || 0, miles: data.distanceStreet });
      }
      console.log(TAG, ' componentWillReceiveProps end ---- ');
    }
  }

  saveUserInfo = debounce(({ kcal = 0, miles = 0 }) => {
    console.log(TAG, ' saveUserInfo begin ');

    this.props.updateRacing({ kcal, miles });
  }, 1000);

  onListenerChanel = () => {
    const { user } = this.state;
    console.log(TAG, ' onListenerChanel = ', user?.fbuid);
    
    if (!_.isEmpty(user)) {
      
      this.roomDataPrefference.on('value', dataSnap => {
        const data = dataSnap?.toJSON() || {};
        let arr = [];
        let playersColor = {};
        console.log(TAG, ' onListenerChanel ---- ', data);
        
        let index = 0;
        Object.keys(data).forEach(key => {
          const value = data[key];

          console.log(TAG, ' updateDataFromOtherPlayer -', value);
          if (!_.isEmpty(value)) {
            value['fbuid'] = key;
            value['isMe'] = key === user?.fbuid;
            const player = new Player(value);
            playersColor[key] = colors[index];
            arr.push(player);
            index++;
          }
        });

        this.setState({
          players: arr,
          playersColor:playersColor
        });
      });
    }
  };

  renderPlayersMarker = ()=>{
    const {players = [],playersColor = {}} = this.state;
    let indexPosition;
    let pos = {};
    const markers =  players.map(player => {
      if (!_.isEmpty(player) && !player.isMe) {
        indexPosition = Math.floor((this.listPoint.length * player.goal) / 100);
        pos = this.getCurrentPoint(indexPosition);
        // return this.renderMarkerPlayers(this.getCurrentPoint(indexPosition));
        return icons.close({
          color: playersColor[player.fbuid] ||'red',
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
      }
    });
    return markers;
  }

  componentDidMount() {
    this.props.getUser();
  }

  renderMap = () => {
    const { room, isReady } = this.state;
    const uriPhoto =  { uri: room?.photo || '' } || images.map;
    
    return (
      <View style={styles.map}>
        <ImageZoom 
          cropWidth={this.widthMap}
          cropHeight={screenSize.height}
          imageWidth={this.widthMap}
          minScale={1}
          maxScale={2}
          imageHeight={heightMap}>
            <ImageBackground
              style={{ width: this.widthMap, height: heightMap }}
              resizeMode="contain"
              source={uriPhoto}>
                {this.renderMarker()}
                {this.renderPlayersMarker()}
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

  // renderMarkerPlayers = (pos = {}) => {
  //   if(!_.isEmpty(pos)){
  //     return icons.close({
  //       color: 'red',
  //       size: sizeIconRacing.width,
  //       iconStyle:{
  //         margin:0
  //       },
  //       containerStyle: {
  //         paddingVertical:0,
  //         paddingHorizontal:0,
  //         width: sizeIconRacing.width,
  //         height: sizeIconRacing.height,
  //         position: 'absolute',
  //         top: pos.y ,
  //         left: pos.x
  //       }
  //     });
  //   }
  //   return null;
  // };

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
    this.roomDataPrefference?.off('value');
  }

  onPressClose = this.onClickView(async () => {
    const { room } = this.state;
    this.props.leftRoom({ session: room?.session });
    this.replaceScreen(this.props.navigation, TAGHOME);
  });

  render() {
    const { room, user,players=[] } = this.state;
    return (
      <View style={styles.container}>
        {this.renderMap()}
        <View style={{ alignItems: 'center' }}>
          <BikerProfile onStreamCreated={this.onStreamCreated} onStreamDestroyed={this.onStreamDestroyed} room={room} user={user} players={players} />
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
