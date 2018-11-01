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
import { TAG as TAGCREATE } from '@/screens/Create';
import { Button } from 'react-native-elements';
import styles,{sizeIconRacing} from './styles';
import BikerProfile from '@/components/BikerProfile';
import Room from '@/models/Room';
import images, { icons } from '@/assets';

import { connect } from 'react-redux';
import { fetchUser, updateRacing } from '@/actions/UserAction';
import { leftRoom,startRacing,finishedRoom } from '@/actions/RoomAction';
import { connectAndPrepare, disconnectBluetooth } from '@/actions/RaceAction';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import { scale,verticalScale } from 'react-native-size-matters';
import firebase from 'react-native-firebase';
import _, { debounce } from 'lodash';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import ImageZoom from 'react-native-image-pan-zoom';
import Player from '@/models/Player';
import Util from '@/utils/Util';
import ViewUtil from '@/utils/ViewUtil';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';

export const TAG = 'ChallengeScreen';
let heightMap = screenSize.height;
const dialogPercentHeight = 0.8;
const dialogHeightImage = screenSize.height*dialogPercentHeight;
const colors = ['purple','blue','yellow','green'];
let lastIndexPosition = 0;
let currentPositionIndex = 0;
let listLastIndexPosition = {};
const limitToRotate = (20+90) * (Math.PI/180);
const FastImageView = createImageProgress(FastImage);
class ChallengeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    const room: Room = new Room(props.navigation?.state.params);
    // const { width = 0, height = 1 } = Image.resolveAssetSource(images.map);
    const { width = 0, height = 1 } = room?.getMapSize()||{};
    console.log(TAG,' constructor widthRealMap = ',width,' heightRealMap = ',height);
    const sizeMap = Util.calculateMapSize({widthReal:width,heightReal:height});
    this.ratios = sizeMap.ratios;
    this.scaleSize = sizeMap.scaleSize;
    this.listPoint = room.getPathOfMap();
    const pointStart = this.getCurrentPoint();
    const angle = this.getAngleWithCurrentPoint(0) ;
    this.posInit = {
      y: pointStart.y,
      x: pointStart.x,
      rotate:angle
    };
    this.widthMap = sizeMap.width;
    heightMap = sizeMap.height;
    console.log(TAG,' constructor widthMap = ',this.widthMap,' heightMap = ',heightMap);
    this.state = {
      room: room,
      user: {},
      pos: this.posInit,
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
      x = (Number(pointStart[0])) * this.scaleSize - sizeIconRacing.width/2;
      y = (Number(pointStart[1])) * this.scaleSize - sizeIconRacing.height/2;
    } catch (error) {
      
    }
    return {
      x,y
    }; 
    
  };

  getAngleWithCurrentPoint = (currentPositionIndex = 0)=>{
    currentPositionIndex =  (currentPositionIndex % this.listPoint.length) || 0;
    const nextIndex = ((currentPositionIndex+1) % this.listPoint.length) || 1;
    const pointStart = this.getCurrentPoint(currentPositionIndex);
    const futurePoint = this.getCurrentPoint(nextIndex);
    return Math.atan2(futurePoint.y - pointStart.y, futurePoint.x - pointStart.x) + Math.PI/2;
    // return Math.atan2(futurePoint.y - pointStart.y, futurePoint.x - pointStart.x); 
  }

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
    return (<View style={{
        backgroundColor:'#81b1ff23',
        borderRadius:sizeIconRacing.width/2,
        width:sizeIconRacing.width,
        height:sizeIconRacing.width,
        position: 'absolute',
        top: pos.y ,
        justifyContent:'center',
        left: pos.x
    }}>
    <View style={{
      backgroundColor:color,
      alignSelf:'center',
      borderRadius:sizeIconRacing.width/2 - scale(10),
      width:sizeIconRacing.width - scale(20),
      height:sizeIconRacing.width - scale(20),
  }}/>
    </View>);
    
    // return icons.markerPlayer({
    //   color: color,
    //   size: sizeIconRacing.width,
    //   iconStyle:{
    //     margin:0
    //   },
    //   containerStyle: {
    //     paddingVertical:0,
    //     paddingHorizontal:0,
    //     position: 'absolute',
    //     top: pos.y ,
    //     left: pos.x
    //   }
    // });
  }

  componentDidMount() {
    this.props.getUser();
    // this.popupDialog.show();
  }
  updateHandler = ({ touches, screen, time }) => {
    
    if(lastIndexPosition < currentPositionIndex){
      
      const tempIndex = Math.ceil(lastIndexPosition);
      const nextPoint = this.getCurrentPoint(tempIndex);
      
      if(tempIndex!== currentPositionIndex){
        console.log(TAG,' updateHandler nextPoint begin');
        const {pos = this.posInit} = this.state;
        let angle = this.getAngleWithCurrentPoint(tempIndex);
        angle = (Math.abs(angle - pos.rotate)<limitToRotate)? pos.rotate:angle; 
        console.log(TAG,' updateHandler nextPoint Player = ',angle); 
        const posNew = {
          x:nextPoint.x,
          y:nextPoint.y,
          rotate:angle
        };
        this.setState({
          pos:posNew
        });
        lastIndexPosition += (currentPositionIndex - lastIndexPosition)*time.delta/1000;
      }else{
        lastIndexPosition = currentPositionIndex;
      }
      
    }

    // update position list player
    const {players = [],playersColor = {},playersMarker = []} = this.state;
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

    if(isHaveChange || playersMarker?.length!== markers?.length){
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
    // let players = [
    //   { playerName: 'HienTon', goal: 27 },
    //   { playerName: 'HIEn', goal: 27 },
    //   { playerName: 'HTOn27', goal: 27 },
    //   { playerName: 'HTOn22', goal: 22 },
    //   { playerName: 'HienTon100', goal: 100 },
    //   { playerName: 'HTon', goal: 25 },
    //   { playerName: 'HTon', goal: 25 },
    //   { playerName: 'HTon', goal: 25 }
    // ];

    let {players=[]} = this.state;
    // sort list player

    players?.sort((a,b)=>Number(b.goal) - Number(a.goal))||[];
    return (
      <FastImage
        style={{flex: 1,width:dialogHeightImage,height:dialogHeightImage}}
        resizeMode={FastImage.resizeMode.stretch}
        source={images.back_score}
      >
        <View style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 30 }}>
          <Text
            style={[
              TextStyle.extraText,
              {
                textAlign: 'center',
                color: 'white',
                fontWeight: '600',
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
              {players.map(player => {
                const iconResult =Number(player.goal) >= 100? images.ic_gold:images.ic_sliver;
                return (
                  <View style={{ flexDirection: 'row', marginVertical:verticalScale(5),flex:1 }}>
                    <Image source={iconResult}  style={{alignSelf:'center'}}/>
                    <View style={{ justifyContent: 'center', marginLeft: scale(15),flex:1 }}>
                      <Text
                        style={[
                          TextStyle.bigText,
                          {
                            paddingTop:20,
                            color: 'white',
                            textAlignVertical: 'center'
                          }
                        ]}
                      >
                        {player.playerName || ''}
                      </Text>
                      <Text
                        style={[
                          TextStyle.normalText,
                          { color: 'white', textAlignVertical: 'center',fontWeight:'bold',borderBottomWidth:1,borderColor:'#8d8d8d20', flex:1,paddingVertical:20 }
                        ]}
                      >
                      <Text style={[
                        TextStyle.normalText,
                        { color: '#8d8d8d' ,fontWeight:'normal'}
                      ]}>{Number(player.goal) >= 100
                        ? 'The Champion'
                        : `Finished `}</Text>
                         {Number(player.goal) >= 100
                          ? ''
                          : `${Number(player.goal)}%`}
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
      </FastImage>
    );
  };

  onPressFinish = this.onClickView(()=>{
    this.replaceScreen(this.props.navigation,TAGCREATE);
  });

  renderMap = () => {
    const { user, room, isReady, playersMarker=[],isLoading = false,players = []} = this.state;
    const uriPhoto = room?.photo ?  { uri: room?.photo  } : images.image_start;
    const markersView = this.renderMarker();
    return (
      <GameLoop style={styles.map} onUpdate={this.updateHandler} >
        <ImageZoom 
          cropWidth={this.widthMap}
          cropHeight={screenSize.height}
          imageWidth={this.widthMap}
          minScale={1}
          maxScale={2}
          imageHeight={heightMap}>
          <FastImageView
            style={{ width: this.widthMap, height: heightMap}}
            resizeMode={FastImage.resizeMode.contain}
            source={uriPhoto}>
            {playersMarker}
            {markersView}
          </FastImageView>
         
        </ImageZoom>
        

        {isReady || user?.id!== room.userId || playersMarker?.length<=1 ? null : (
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

  renderMarker = (pos = this.state.pos || this.posInit) => {
    return (<Image source={images.ic_racer1} 
        resizeMode='center'
        style={{
          backgroundColor:'transparent',
          position: 'absolute',
          top: pos.y ,
          left: pos.x,
          width:sizeIconRacing.width,
          height:sizeIconRacing.height,
          transform:[{rotate:`${pos.rotate}rad`}]
        }}
    />);

    // return icons.markerPlayer({
    //   color: 'red',
    //   size: sizeIconRacing.width,
    //   containerStyle: {
    //     paddingVertical:0,
    //     paddingHorizontal:0,
    //     position: 'absolute',
    //     top: pos.y ,
    //     left: pos.x
    //   }
    // });
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
      
    } catch (error) {
      this.showLoadingAllScreen = false;
    }finally{
      this.replaceScreen(this.props.navigation, TAGCREATE);
    }
    
  });

  set showLoadingAllScreen(isShow){
    this.setState({isLoadingAllScreen:isShow});
  }

  render() {
    const { room, user,players=[],isLoadingAllScreen = false,playersColor = {} } = this.state;
    return (
      <View style={styles.container}>
        {this.renderMap()}
        <View style={{ alignItems: 'center' }}>
          <BikerProfile onStreamCreated={this.onStreamCreated} onStreamDestroyed={this.onStreamDestroyed} room={room} user={user} players={players} playersColor={playersColor} />
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
          height={`${dialogPercentHeight*100}%`}
          hasOverlay
          dialogStyle={{backgroundColor:'transparent'}}
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
