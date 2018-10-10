import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground
} from 'react-native';
import { GameLoop } from "react-native-game-engine";
import BaseScreen from '@/screens/BaseScreen';
import PopupDialog from 'react-native-popup-dialog';

import { Button } from 'react-native-elements';
import styles,{sizeIconRacing} from './styles';
import BikerProfile from '@/components/BikerProfile';
import Room from '@/models/Room';
import images, { icons } from '@/assets';
import { TAG as TAGHOME } from '@/screens/Home';
import { connect } from 'react-redux';
import { fetchUser, updateRacing } from '@/actions/UserAction';
import { leftRoom,startRacing,finishedRoom } from '@/actions/RoomAction';
import { connectAndPrepare, disconnectBluetooth } from '@/actions/RaceAction';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import firebase from 'react-native-firebase';
import _, { debounce } from 'lodash';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import ImageZoom from 'react-native-image-pan-zoom';
import Player from '@/models/Player';
import Util from '@/utils/Util';
import ViewUtil from '@/utils/ViewUtil';

export const TAG = 'ChallengeScreen';
let heightMap = screenSize.height;
const colors = ['purple','blue','yellow','green'];
let lastIndexPosition = 0;
let currentPositionIndex = 0;
let listLastIndexPosition = {};
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
      playersMarker:[],
      race: {},
      distanceRun: 0,
      kcal: 0,
      isLoading: false,
      isLoadingAllScreen: false,
      isFinished: false,
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
      const pointStart: [] = this.listPoint[currentPositionIndex || 0];
      // console.log(TAG, ' getCurrentPoint - nextPoint = ', pointStart);
      x = (Number(pointStart[0])) * this.scaleSize - sizeIconRacing.width;
      y = (Number(pointStart[1])) * this.scaleSize - sizeIconRacing.height;
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
      isFinished,
      isReady,
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
      if (isReady && !isFinished && this.playerMeDataPrefference) {
        const s = distanceRun + (data.distanceStreet || 0);
        const sumKcal = kcal + (data.kcal || 0);
        // caculate goal
        const goalPercentNumber = (s * 100 / room?.miles) || 0;
        const goal = Math.ceil(goalPercentNumber) || 0;
        console.log(TAG, ' componentWillReceiveProps 01 - s = ', s);

        const indexPosition = Math.ceil((this.listPoint.length * goalPercentNumber) / 100);
        const isFinished = goal>=100;
        currentPositionIndex = indexPosition;
        this.setState({
          isFinished:isFinished,
          isLoading:false,
          race: race,
          distanceRun: s,
          kcal: sumKcal
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

        // call api when goal :100
        if(isFinished){
          this.props.finishedRoom({session:room.session});
        }
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
    // console.log(TAG, ' onListenerChanel = ', user?.fbuid);
    
    if (!_.isEmpty(user)) {
      
      this.roomDataPrefference.on('value', dataSnap => {
        const data = dataSnap?.toJSON() || {};
        let arr = [];
        let playersColor = {};
        console.log(TAG, ' onListenerChanel ---- ', data);
        
        let index = 0;
        let isGetReady = false;
        let isFinished = false;
        Object.keys(data).forEach(key => {
          const value = data[key];

          // console.log(TAG, ' updateDataFromOtherPlayer -', value);
          if (!_.isEmpty(value)) {
            value['fbuid'] = key;
            value['isMe'] = key === user?.fbuid;
            isGetReady = value['status'] === 2 || isGetReady;            
            const player = new Player(value);
            playersColor[key] = colors[index];
            arr.push(player);
            isFinished = player.goal>=100 || isFinished;
            index++;

          }
        });

        this.setState({
          isFinished:isFinished,
          isReady:isGetReady||this.state.isReady,
          players: arr,
          playersColor:playersColor
        });
        if(isFinished){
          this.finishedRacing();
        }
      });
    }
  };

  createMarkerWithPosition= (pos={x:0,y:0},color = 'red')=>{
    return icons.close({
      color: color,
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

  componentDidMount() {
    this.props.getUser();
  }
  updateHandler = ({ touches, screen, time }) => {
    if(lastIndexPosition < currentPositionIndex){
      const nextPoint = this.getCurrentPoint(Math.ceil(lastIndexPosition));
      if(nextPoint!== currentPositionIndex){
        this.setState({
          pos:{
            x:nextPoint.x,
            y:nextPoint.y
          }
        });
        lastIndexPosition += (currentPositionIndex - lastIndexPosition)*time.delta/1000;
      }else{
        lastIndexPosition = currentPositionIndex;
      }
      
    }

    // update position list player
    const {players = [],playersColor = {}} = this.state;
    let indexPosition;
    let lastIndex = 0;
    let nextPoint = {};
    let isHaveChange = false;
    const markers =  players.map(player => {
      if (!_.isEmpty(player) && !player.isMe) {
        indexPosition = Math.ceil((this.listPoint.length * player.goal) / 100);
        lastIndex  = listLastIndexPosition[player.fbuid]||0;
        if(lastIndex <indexPosition){
          isHaveChange = true;
          lastIndex += (indexPosition - lastIndex)*time.delta/1000;
        }else{
          lastIndex = indexPosition;
        };
        listLastIndexPosition[player.fbuid] = lastIndex||0;
        nextPoint = this.getCurrentPoint(Math.ceil(lastIndex));
        return this.createMarkerWithPosition(nextPoint,playersColor[player.fbuid]);
      }
    });

    if(isHaveChange){
      this.setState({
        playersMarker:markers
      });     
    }

  };
  finishedRacing = this.onClickView(()=>{
    this.roomDataPrefference?.off('value');
    // show dialog
    this.popupDialog.show();
  });

  renderDashBoardAchivement = () => {
    // const players = [
    //   { playerName: 'HienTon', goal: 27 },
    //   { playerName: 'HIEn', goal: 27 },
    //   { playerName: 'HTOn', goal: 27 },
    //   { playerName: 'HTOn', goal: 22 },
    //   { playerName: 'HTon', goal: 25 }
    // ];

    const {players=[]} = this.state;
    // sort list player
    return (
      <ImageBackground
        width="100%"
        height="100%"
        style={{ width: '100%', height: '100%', flex: 1 }}
        resizeMode="stretch"
        source={images.back_score}
      >
        <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 20 }}>
          <Text
            style={[
              TextStyle.mediumText,
              {
                textAlign: 'center',
                color: 'white',
                fontWeight: "600",
                textAlignVertical: 'center'
              }
            ]}
          >
            You are all finished!
          </Text>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ flex: 1 }}>
              {players.sort((a,b)=>a.goal>b.goal).map(player => {
                return (
                  <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                    <Image source={images.ic_gold} />
                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                      <Text
                        style={[
                          TextStyle.mediumText,
                          {
                            color: 'white',
                            textAlignVertical: 'center'
                          }
                        ]}
                      >
                        {player.playerName || 'No Name'}
                      </Text>
                      <Text
                        style={[
                          TextStyle.normalText,
                          { color: 'white', textAlignVertical: 'center' }
                        ]}
                      >
                        {Number(player.goal) >= 100
                          ? 'To Finish'
                          : Number(player.goal)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <Button
            title="OK"
            onPress={this.onPressFinish}
            buttonStyle={[styles.button, { backgroundColor: '#02BB4F',width:'30%',alignSelf:'center' }]}
            textStyle={[TextStyle.mediumText, { fontWeight: 'bold' }]}
          />
        </View>
      </ImageBackground>
    );
  };

  onPressFinish = this.onClickView(()=>{
    this.replaceScreen(this.props.navigation,TAGHOME);
  });

  renderMap = () => {
    const { user, room, isReady, playersMarker=[],isLoading = false} = this.state;
    const uriPhoto =  { uri: room?.photo || '' } || images.map;
    
    return (
      <GameLoop style={styles.map} onUpdate={this.updateHandler} >
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
                {
                  playersMarker
                }
            </ImageBackground>
        </ImageZoom>
        

        {isReady || user?.id!== room.userId ? null : (
          <Button
            loading={isLoading}
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
      </GameLoop>
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

  onPressReady = this.onClickView(async () => {
    const {room} = this.state;
    if(room &&room.session){
      this.setState({ isLoading: true });
      await this.props.startRacing({session:room.session});
      this.setState({ isLoading: false });
    }
  });

  componentWillUnmount() {
    console.log(TAG, ' componentWillUnmount ok');
    // this.props.disconnectBluetooth();
    this.roomDataPrefference?.off('value');
  }

  onPressClose = this.onClickView(async () => {
    try {
      const { room } = this.state;
      this.showLoadingAllScreen = true;
      await Util.excuteWithTimeout(this.props.leftRoom({ session: room?.session }),4);
      this.replaceScreen(this.props.navigation, TAGHOME);  
    } catch (error) {
      this.showLoadingAllScreen = false;
    }finally{
      
    }
    
  });

  set showLoadingAllScreen(isShow){
    this.setState({isLoadingAllScreen:isShow});
  }

  render() {
    const { room, user,players=[],isLoadingAllScreen = false } = this.state;
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
        {ViewUtil.CustomProgressBar({visible:isLoadingAllScreen})}
        <PopupDialog
          width="70%"
          height="90%"
          hasOverlay
          dismissOnTouchOutside={false}
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
          {this.renderDashBoardAchivement()}  
        </PopupDialog>
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
    isReady: state.room?.isReady,
    race: state.race
  }),
  {
    getUser: fetchUser,
    updateRacing,
    finishedRoom,
    connectAndPrepare,
    leftRoom,
    startRacing,
    disconnectBluetooth
  }
)(ChallengeScreen);
