import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar
} from 'react-native';
import { GameLoop } from 'react-native-game-engine';
import BaseScreen from '@/screens/BaseScreen';
import PopupDialog from 'react-native-popup-dialog';
import { TAG as TAGCREATE } from '@/screens/Create';
import { Button } from 'react-native-elements';
import BikerProfile from '@/components/BikerProfile';
import Room from '@/models/Room';
import images, { icons } from '@/assets';
import { connect } from 'react-redux';
import { fetchUser, updateRacing } from '@/actions/UserAction';
import { leftRoom, startRacing, finishedRoom } from '@/actions/RoomAction';
import { connectAndPrepare, disconnectBluetooth } from '@/actions/RaceAction';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import { scale, verticalScale } from 'react-native-size-matters';
import _, { debounce } from 'lodash';
import Constants, {
  STATE_BLUETOOTH,
  CONSTANT_MESSAGE,
  BUILD_MODE
} from '@/utils/Constants';
import ImageZoom from 'react-native-image-pan-zoom';
import Player, { FBUID_TEMPLATE } from '@/models/Player';
import Util from '@/utils/Util';
import ViewUtil from '@/utils/ViewUtil';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Animatable from 'react-native-animatable';
import styles, { sizeIconRacing } from './styles';

export const TAG = 'ChallengeScreen';
const heightScreen = screenSize.height;
let heightMap = heightScreen;
const dialogPercentHeight = 0.8;
const dialogHeightImage = screenSize.height * dialogPercentHeight;
const colors = ['purple', 'blue', 'yellow', 'green'];

const limitToRotate = 60 * (Math.PI / 180);
const FastImageView = createImageProgress(FastImage);
let firstDataForTesing = {
  E8oouxYufVbXPWssHdL9NqUfxZl1: {
    streamId: 'D4CE87E6-FCA2-408D-A858-3C831BC4D731',
    status: 2,
    speed: 0,
    playerName: 'Hh11',
    token:
      'T1==cGFydG5lcl9pZD00NjE1NDQyMiZzaWc9MThlMTQzMjEyZGZjOTQ1MTBhODhmM2RlZWJlOWE0YzM3MzNkZWNiNTpzZXNzaW9uX2lkPTJfTVg0ME5qRTFORFF5TW41LU1UVTBNelF3TXpJMk9UUXpNMzU2Vldaak1HdEtVWE5KVDJwcGVYSnZRVlJyVnl0TE0zWi1mZyZjcmVhdGVfdGltZT0xNTQzNDAzMjY5Jm5vbmNlPTkwNzAyJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1NDM0ODk2Njk=',
    goal: 0,
    archivement: 0
  }
};
class ChallengeScreen extends BaseScreen {
  constructor(props) {
    if (BUILD_MODE.isModeRecordVideo) {
      StatusBar.setHidden(true);
    }
    super(props);
    const room: Room = new Room(props.navigation?.state.params);
    this.lastIndexPosition = 0;
    this.currentPositionIndex = 0;
    this.listLastIndexPosition = {};
    const { width = 0, height = 1 } = room?.getMapSize() || {};
    const sizeMap = Util.calculateMapSize({
      widthReal: width,
      heightReal: height
    });
    this.sizeMap = sizeMap;
    this.ratios = sizeMap.ratios;
    this.scaleSize = sizeMap.scaleSize;
    this.listPoint = room.getPathOfMap();
    const pointStart = this.getCurrentPoint();
    const angle = this.getAngleWithCurrentPoint(0);
    this.posInit = {
      y: pointStart.y,
      x: pointStart.x,
      rotate: angle
    };
    this.widthMap = sizeMap.widthExpect;
    heightMap = sizeMap.heightExpect;
    this.state = {
      room: room,
      user: {},
      pos: this.posInit,
      playersColor: {},
      players: [],
      winner: {},
      playersMarker: [],
      race: {},
      distanceRun: 0,
      kcal: 0,
      isLoading: false,
      isLoadingAllScreen: false,
      isFinished: false,
      isReady: false
    };
    this.players = [];

    // ROOM_DETAIL_<SESSION_ID>
    //  ROOM_PLAYERS_<SESSION_ID>
    //  CH_PLAYER_<USER_ID>
    // this.pathKey = `games/race-rooms/${room?.session || ''}`;
    // this.dataPrefference = this.firebase.database().ref(this.pathKey);

    this.chanelGroupRoomKey = {
      DETAIL: `ROOM_DETAIL_${room?.session || ''}`,
      PLAYERS: `ROOM_PLAYERS_${room?.session || ''}`
    };
    // this.chanelGroupRoomMessage = {
    //   channelGroups:[this.chanelGroupRoomKey],

    // };
    // this.roomDataPrefference = this.dataPrefference?.child('players');

    this.roomDataPrefference = {
      subscribe: {
        channelGroups: [this.chanelGroupRoomKey.PLAYERS]
        // dont use
        // channelGroup: this.chanelGroupRoomKey.PLAYERS
      },
      listener: {
        message: function(message) {
          const dataSnap = message;
          console.log(TAG, ' onListenerChanel begin');
          console.log(dataSnap);
          const { user, room } = this.state;
          const data = dataSnap?.toJSON() || {};

          let arr = [];
          let playersColor = {};
          console.log(TAG, ' onListenerChanel ---- ', data);

          let index = 0;
          let isGetReady = false,
            isFinished = false;
          let winner = null;
          let reachMeMessage = '';

          Object.keys(data).forEach(key => {
            const value = data[key];

            // console.log(TAG, ' updateDataFromOtherPlayer -', value);
            if (!_.isEmpty(value)) {
              value['fbuid'] = key;
              value['isMe'] = key === user?.id;
              isGetReady = value['status'] === 2 || isGetReady;
              const player = new Player(value);
              playersColor[key] = colors[index];
              arr.push(player);
              isFinished = player.goal >= 100 || isFinished;
              index++;
              winner = !winner || player.goal > winner.goal ? player : winner;

              // many case with is ME
              reachMeMessage =
                value['isMe'] && [20, 50, 70, 90, 99].includes(value.goal)
                  ? value.goal
                  : '';
            }
          });
          if (reachMeMessage) {
            const arr = CONSTANT_MESSAGE[`REACH_${reachMeMessage}`];
            const distance = (reachMeMessage * room?.miles) / 100 || 0;
            const message = arr(distance)[Util.getRandomInt(0, arr.length - 1)];
            this.readText(message);
          }

          if (
            isGetReady &&
            !isFinished &&
            this.state.winner &&
            winner &&
            winner['fbuid'] !== this.state.winner['fbuid']
          ) {
            const arr = winner['isMe']
              ? CONSTANT_MESSAGE.PASS_X
              : CONSTANT_MESSAGE.X_PASS;

            const index = Util.getRandomInt(0, arr().length - 1);
            const message = arr(
              (winner['isMe']
                ? this.state.winner.playerName
                : winner['playerName']) || ''
            )[index];
            console.log(
              TAG,
              ' updateDataFromOtherPlayer - readText PASSS - ',
              message
            );
            this.readText(message);
          }
          this.setState({
            isFinished: isFinished,
            isReady: isGetReady || this.state.isReady,
            players: arr,
            winner: winner,
            playersColor: playersColor
          });
          if (isFinished) {
            if (winner) {
              // read text
              const arr = winner['isMe']
                ? CONSTANT_MESSAGE.FINISH_ANNOUCE_ME
                : CONSTANT_MESSAGE.FINISH_OTHER;
              const index = Util.getRandomInt(0, arr.length - 1);
              const s = arr(winner.playerName)[index];
              this.readText(s);
            }
            this.finishedRacing();
          }
        }
      },
      publish: {}
    };

    this.roomDetailPrefference = {
      subscribe: {
        channels: [this.chanelGroupRoomKey.DETAIL]
      },
      listener: {
        message: this.onDataRealTime,
        presence: function(presence) {
          console.log(TAG, 'FRIEND PRESENCE: ', presence);
        }
      },

      publish: {}
    };
  }
  onDataRealTime = data => {
    // console.log(TAG, 'onDataRealTime data ', data);
    const { message = {}, channel = '', subscribedChannel = '' } = data;
    switch (subscribedChannel) {
      case this.chanelGroupRoomKey.DETAIL: {
        let isGetReady = message['status'] === 2;
        this.setState({
          isReady: isGetReady || this.state.isReady
        });
        break;
      }
      case this.chanelGroupRoomKey.PLAYERS: {
        // update list player
        console.log(TAG, ' onDataRealTime begin ---------------');
        const { user, room, isReady, playersColor } = this.state;
        // console.log(TAG, ' onDataRealTime begin userId', user.id);
        let value = message || {};

        let arr = this.players || [];
        let playersColorTemp = playersColor || {};

        console.log(TAG, ' onDataRealTime value ---- ', value);
        let isFinished = false;
        let winner: Player = null;
        let reachMeMessage = '';
        if (!_.isEmpty(value)) {
          const key = `${FBUID_TEMPLATE}${value.userId}`;
          let indexPlayer = arr.findIndex(
            item => String(item.userId) == String(value.userId)
          );
          value['fbuid'] = key;
          value['isMe'] = value.userId == user.id;
          value['status'] = isReady ? 2 : 1;
          value = indexPlayer >= 0 ? { ...arr[indexPlayer], ...value } : value;

          const player = new Player(value);
          if (indexPlayer >= 0) {
            playersColorTemp[key] = colors[indexPlayer];
            arr[indexPlayer] = player;
          } else {
            arr.push(player);
            indexPlayer = arr.indexOf(player);
            playersColorTemp[key] = colors[indexPlayer];
          }
          console.log(
            TAG,
            ' onDataRealTime color ---- ',
            playersColorTemp[key],
            ' playerName = ',
            value['playerName'],
            ',streamId = ',
            value['streamId']
          );
          // console.log(TAG, ' onDataRealTime after size player = ', arr.length);
          isFinished = player.goal >= 100 || isFinished;
          winner = !winner || player.goal > winner.goal ? player : winner;

          // many case with is ME
          reachMeMessage =
            player.isMe && [20, 50, 70, 90, 99].includes(value.goal)
              ? value.goal
              : '';
        }
        if (reachMeMessage) {
          const arr = CONSTANT_MESSAGE[`REACH_${reachMeMessage}`];
          const distance = (reachMeMessage * room?.miles) / 100 || 0;
          const message = arr(distance)[Util.getRandomInt(0, arr.length - 1)];
          this.readText(message);
        }

        if (
          isReady &&
          !isFinished &&
          this.state.winner &&
          winner &&
          winner.id !== this.state.winner['id']
        ) {
          const arr = winner.isMe
            ? CONSTANT_MESSAGE.PASS_X
            : CONSTANT_MESSAGE.X_PASS;

          const index = Util.getRandomInt(0, arr().length - 1);
          const message = arr(
            (winner.isMe ? this.state.winner.playerName : winner.playerName) ||
              ''
          )[index];
          // console.log(
          //   TAG,
          //   ' updateDataFromOtherPlayer - readText PASSS - ',
          //   message
          // );
          this.readText(message);
        }
        this.players = arr;
        this.setState({
          isFinished: isFinished,
          players: arr,
          winner: winner,
          playersColor: playersColorTemp
        });
        if (isFinished) {
          if (winner) {
            // read text
            const arr = winner['isMe']
              ? CONSTANT_MESSAGE.FINISH_ANNOUCE_ME
              : CONSTANT_MESSAGE.FINISH_OTHER;
            const index = Util.getRandomInt(0, arr.length - 1);
            const s = arr(winner.playerName)[index];
            this.readText(s);
          }
          this.finishedRacing();
        }
        console.log(TAG, ' onDataRealTime end ***************');
        break;
      }
    }
    // console.log(TAG, 'onDataRealTime end ', message);
  };

  onStreamCreated = streamId => {
    const { user = {}, room, playersColor } = this.state;
    // push stream Id on firebase
    if (!_.isEmpty(streamId) && !_.isEmpty(user)) {
      const userId = user.id;
      const listPlayers: Player[] = room?.listPlayers(userId, streamId);
      const message = new Player({
        ...user,
        userId: userId,
        streamId: streamId
      }).messageToPublish();
      this.playerMeDataPrefference = {
        channelName: `CH_PLAYER_${userId || ''}`,
        subscribe: {
          channelGroups: [this.chanelGroupRoomKey.PLAYERS],
          channels: [`CH_PLAYER_${userId || ''}`]
        },
        publish: {
          channelGroup: this.chanelGroupRoomKey.PLAYERS,
          channel: `CH_PLAYER_${userId || ''}`,
          message: message
        }
      };
      console.log(TAG, ' onStreamCreated message ', message);
      

      // update streamId in players->chanel(user.fbuid||user.id)
      // this.playerMeDataPrefference.publish['message'] = message;
      this.pubnub.subscribe(this.playerMeDataPrefference.subscribe);
      this.pubnub.publish(
        this.playerMeDataPrefference.publish,
        (status, response) => {
          // console.log(
          //   TAG,
          //   ' pubnub.publish -onStreamCreated -  begin -status = ',
          //   status
          // );
        }
      );
      this.players = listPlayers;
      let playersColorTemp = playersColor || {};

      listPlayers.forEach((playerObj, index) => {
        playersColorTemp[playerObj.fbuid] = colors[index];
      });

      this.setState({
        players: listPlayers,
        playersColor: playersColorTemp
      });

      // this.dataPrefference
      //   ?.child('players')
      //   ?.child(user.fbuid)
      //   .update({ streamId: streamId });
      // this.onListenerChanel();
    }
  };
  onStreamDestroyed = streamId => {
    if (streamId && !this.state.isLoadingAllScreen) {
      this.onPressClose();
    }
  };
  getCurrentPoint = (currentPositionIndex = 0) => {
    let x,
      y = 0;
    try {
      const pointStart: [] = this.listPoint[currentPositionIndex || 0];
      // console.log(TAG, ' getCurrentPoint - nextPoint = ', pointStart);
      x = Number(pointStart[0]) * this.scaleSize - sizeIconRacing.width / 2;
      y = Number(pointStart[1]) * this.scaleSize - sizeIconRacing.height / 2;
    } catch (error) {}
    return {
      x,
      y
    };
  };

  getAngleWithCurrentPoint = (currentPositionIndex = 0) => {
    currentPositionIndex = currentPositionIndex % this.listPoint.length || 0;
    const nextIndex = (currentPositionIndex + 1) % this.listPoint.length || 1;
    const pointStart = this.getCurrentPoint(currentPositionIndex);
    const futurePoint = this.getCurrentPoint(nextIndex);
    return (
      Math.atan2(futurePoint.y - pointStart.y, futurePoint.x - pointStart.x) +
      Math.PI / 2
    );
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
    console.log(TAG, ' componentWillReceiveProps begin --------');
    if (!_.isEqual(nextProps?.user, user)) {
      this.setState(
        {
          user: nextProps.user,
          isLoading: false,
          race: nextProps.race
        },
        () => {
          if (
            _.isEmpty(this.state.race) ||
            race.state !== STATE_BLUETOOTH.CONNECTED
          ) {
            // console.log(
            //   TAG,
            //   ' componentWillReceiveProps - user = ',
            //   nextProps?.user
            // );
            // this.playerMeDataPrefference = this.dataPrefference
            //   ?.child('players')
            //   ?.child(this.state.user.fbuid);

            this.props.connectAndPrepare();
          }
        }
      );
    }
    if (JSON.stringify(nextProps?.race) !== JSON.stringify(this.state.race)) {
      console.log(TAG, ' componentWillReceiveProps race begin ');
      const { race = {} } = nextProps;
      const { data } = race;
      // console.log(TAG, ' componentWillReceiveProps race begin01 data = ', data);
      if (isReady && !isFinished && this.playerMeDataPrefference) {
        const s = distanceRun + (data.distanceStreet || 0);
        const sumKcal = kcal + (data.kcal || 0);
        // caculate goal
        const goalPercentNumber = (s * 100) / room?.miles || 0;
        const goal = Math.ceil(goalPercentNumber) || 0;
        // console.log(TAG, ' componentWillReceiveProps 01 - s = ', s);

        const indexPosition = Math.ceil(
          (this.listPoint.length * goalPercentNumber) / 100
        );
        const isFinished = goal >= 100;
        this.currentPositionIndex = indexPosition;
        this.setState({
          isFinished: isFinished,
          isLoading: false,
          race: race,
          distanceRun: s,
          kcal: sumKcal
        });

        // console.log(
        //   TAG,
        //   ' componentWillReceiveProps02 - goal = ',
        //   goal,
        //   ' - indexPosition = ',
        //   indexPosition,
        //   ' sumKcal = ',
        //   sumKcal
        // );
        if (BUILD_MODE.isModeRecordVideo) {
          // for testing
          const keyFirst = Object.keys(firstDataForTesing)[0];
          firstDataForTesing[keyFirst]['goal'] = goal;
          this.updateDataTesting();
          //////
        }
        // publish value
        this.playerMeDataPrefference.publish['message'] = {
          ...this.playerMeDataPrefference.publish['message'],
          speed: data.speed,
          goal: goal,
          kcal: sumKcal
        };
        this.pubnub.publish(this.playerMeDataPrefference.publish);
        // this.playerMeDataPrefference?.update({
        //   speed: data.speed,
        //   goal: goal,
        //   kcal: sumKcal
        // });

        // save local user
        this.saveUserInfo({ kcal: data.kcal || 0, miles: data.distanceStreet });

        // call api when goal :100
        if (isFinished) {
          this.props.finishedRoom({ session: room.session });
        }
      }
      console.log(TAG, ' componentWillReceiveProps end ---- ');
    }
  }

  saveUserInfo = debounce(({ kcal = 0, miles = 0 }) => {
    // console.log(TAG, ' saveUserInfo begin ');

    this.props.updateRacing({ kcal, miles });
  }, 200);

  updateDataTesting = () => {
    const { user } = this.state;
    // console.log(TAG, ' onListenerChanel = ', user?.fbuid);

    if (!_.isEmpty(user)) {
      const data = firstDataForTesing;
      // for testing
      const keyFirst = Object.keys(data)[0];
      const userToClone = data[keyFirst];

      if (!_.isEmpty(userToClone)) {
        let firstItem = _.cloneDeep(userToClone);
        firstItem['fbuid'] = `${firstItem['fbuid']}0`;
        firstItem['goal'] = Math.abs(firstItem['goal'] + 3);
        data[`${keyFirst}0`] = firstItem;

        let secondItem = _.cloneDeep(userToClone);
        secondItem['fbuid'] = `${userToClone['fbuid']}1`;
        secondItem['goal'] = Math.abs(userToClone['goal'] - 2);
        data[`${keyFirst}1`] = secondItem;
      }
      ////////

      let arr = [];
      let playersColor = {};
      console.log(TAG, ' onListenerChanel ---- ', data);

      let index = 0;
      let isGetReady = false,
        isFinished = false;
      let winner = null;
      let reachMeMessage = '';

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
          isFinished = player.goal >= 100 || isFinished;
          index++;
          winner = !winner || player.goal > winner.goal ? player : winner;

          // many case with is ME
          reachMeMessage =
            value['isMe'] && [20, 50, 70, 90, 99].includes(value.goal)
              ? value.goal
              : '';
        }
      });
      if (reachMeMessage) {
        const arr = CONSTANT_MESSAGE[`REACH_${reachMeMessage}`];
        const distance = (reachMeMessage * this.state.room?.miles) / 100 || 0;
        const message = arr(distance)[Util.getRandomInt(0, arr.length - 1)];
        this.readText(message);
      }

      if (
        isGetReady &&
        !isFinished &&
        this.state.winner &&
        winner &&
        winner['fbuid'] !== this.state.winner['fbuid']
      ) {
        const arr = winner['isMe']
          ? CONSTANT_MESSAGE.PASS_X
          : CONSTANT_MESSAGE.X_PASS;

        const index = Util.getRandomInt(0, arr().length - 1);
        const message = arr(
          (winner['isMe']
            ? this.state.winner.playerName
            : winner['playerName']) || ''
        )[index];
        console.log(
          TAG,
          ' updateDataFromOtherPlayer - readText PASSS - ',
          message
        );
        this.readText(message);
      }
      this.setState({
        isFinished: isFinished,
        isReady: isGetReady || this.state.isReady,
        players: arr,
        winner: winner,
        playersColor: playersColor
      });
      if (isFinished) {
        if (winner) {
          // read text
          const arr = winner['isMe']
            ? CONSTANT_MESSAGE.FINISH_ANNOUCE_ME
            : CONSTANT_MESSAGE.FINISH_OTHER;
          const index = Util.getRandomInt(0, arr.length - 1);
          const s = arr(winner.playerName)[index];
          this.readText(s);
        }
        this.finishedRacing();
      }
    }
  };

  onListenerChanel = () => {
    const { user } = this.state;
    console.log(TAG, ' onListenerChanel = ', user?.fbuid);

    if (!_.isEmpty(user)) {
      // subcribe value 'players'
      // this.pubnub.subscribe(this.roomDataPrefference.subscribe.channelGroups);
      // this.roomDataPrefference?.on('value', dataSnap => {});
    }
  };

  createMarkerWithPosition = (pos = { x: 0, y: 0 }, color = 'red') => {
    return (
      <View
        style={{
          backgroundColor: '#81b1ff23',
          borderRadius: sizeIconRacing.width / 2,
          width: sizeIconRacing.width,
          height: sizeIconRacing.width,
          position: 'absolute',
          top: pos.y,
          justifyContent: 'center',
          left: pos.x
        }}
      >
        <View
          style={{
            backgroundColor: color,
            alignSelf: 'center',
            borderRadius: sizeIconRacing.width / 2 - scale(10),
            width: sizeIconRacing.width - scale(20),
            height: sizeIconRacing.width - scale(20)
          }}
        />
      </View>
    );
  };

  componentWillMount() {
    super.componentWillMount();
    // this.pubnub.subscribe(this.roomDataPrefference.subscribe.channelGroups);
    this.pubnub.addListener(this.roomDetailPrefference.listener);
    this.pubnub.subscribe(this.roomDetailPrefference.subscribe);
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.getUser();
    // this.popupDialog.show();
  }
  updateHandler = ({ touches, screen, time }) => {
    if (
      this.state.isReady &&
      this.lastIndexPosition < this.currentPositionIndex
    ) {
      let tempIndex =
        this.lastIndexPosition +
        ((this.currentPositionIndex - this.lastIndexPosition) * time.delta) /
          1000;
      if (Math.ceil(tempIndex) === Math.ceil(this.lastIndexPosition)) {
        this.lastIndexPosition = tempIndex;
        // return;
      } else {
        tempIndex = Math.ceil(this.lastIndexPosition);
        const nextPoint = this.getCurrentPoint(tempIndex);

        if (tempIndex !== this.currentPositionIndex) {
          // console.log(TAG,' updateHandler nextPoint begin');
          const { pos = this.posInit } = this.state;
          let angle = this.getAngleWithCurrentPoint(tempIndex);
          // console.log(
          //   TAG,
          //   ' updateHandler nextPoint angle ',
          //   angle,
          //   ' - tempIndex = ',
          //   tempIndex
          // );
          const posNew = {
            x: nextPoint.x,
            y: nextPoint.y,
            rotate: angle
          };
          this.setState({
            pos: posNew
          });
          this.lastIndexPosition +=
            ((this.currentPositionIndex - this.lastIndexPosition) *
              time.delta) /
            1000;
        } else {
          this.lastIndexPosition = this.currentPositionIndex;
        }
      }
    }

    // update position list player
    const { players = [], playersColor = {}, playersMarker = [] } = this.state;
    let indexPosition;
    let lastIndex = 0;
    let nextPoint = {};
    let isHaveChange = false;
    const markers = players.map(player => {
      if (!_.isEmpty(player) && !player.isMe) {
        indexPosition = Math.ceil((this.listPoint.length * player.goal) / 100);
        lastIndex = this.listLastIndexPosition[player.fbuid] || 0;
        // console.log(TAG,' updateHandler - players.map indexPosition = ',indexPosition,' lastIndex = ',lastIndex);
        if (lastIndex < indexPosition) {
          isHaveChange = true;
          lastIndex += ((indexPosition - lastIndex) * time.delta) / 1000;
        } else {
          lastIndex = indexPosition;
        }
        this.listLastIndexPosition[player.fbuid] = lastIndex || 0;
        nextPoint = this.getCurrentPoint(Math.ceil(lastIndex));
        return this.createMarkerWithPosition(
          nextPoint,
          playersColor[player.fbuid]
        );
      }
    });

    if (isHaveChange || playersMarker?.length !== markers?.length) {
      // console.log(TAG, ' updateHandler - player change');
      this.setState({
        playersMarker: markers
      });
    }
  };
  finishedRacing = this.onClickView(() => {
    this.pubnub.unsubscribeAll();
    // this.roomDataPrefference?.off('value');

    // show dialog
    this.popupDialog.show();
  });

  renderDashBoardAchivement = () => {
    // let players = [
    // { playerName: 'Kat Brown', goal: 100 },
    // { playerName: 'Elina Hill', goal: 84 },
    // { playerName: 'Jone Miller', goal: 80  },
    //   { playerName: 'HTOn22', goal: 22 },
    //   { playerName: 'HienTon100', goal: 100 },
    //   { playerName: 'HTon', goal: 25 },
    //   { playerName: 'HTon', goal: 25 },
    //   { playerName: 'HTon', goal: 25 }
    // ];
    let { players = [] } = this.state;
    // sort list player

    players?.sort((a, b) => Number(b.goal) - Number(a.goal)) || [];
    return (
      <FastImage
        style={{ flex: 1, width: dialogHeightImage, height: dialogHeightImage }}
        resizeMode={FastImage.resizeMode.stretch}
        source={images.back_score}
      >
        <View
          style={{
            flex: 1,
            paddingVertical: verticalScale(30),
            paddingHorizontal: verticalScale(30)
          }}
        >
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
            <View style={{ flex: 1, marginTop: scale(10) }}>
              {players.map(player => {
                const iconResult =
                  Number(player.goal) >= 100
                    ? images.ic_gold
                    : images.ic_sliver;
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: verticalScale(5),
                      flex: 1,
                      marginTop: 0,
                      paddingHorizontal: scale(10)
                    }}
                  >
                    <Image
                      source={iconResult}
                      style={{ alignSelf: 'center', marginBottom: scale(10) }}
                    />
                    <View
                      style={{
                        justifyContent: 'center',
                        marginLeft: scale(15),
                        flex: 1
                      }}
                    >
                      <Text
                        style={[
                          TextStyle.mediumText,
                          {
                            paddingTop: 10,
                            paddingBottom: 10,
                            color: 'white',
                            fontWeight: 'bold',
                            textAlignVertical: 'center'
                          }
                        ]}
                      >
                        {player.playerName || ''}
                      </Text>
                      <Text
                        style={[
                          TextStyle.normalText,
                          {
                            color: 'white',
                            textAlignVertical: 'center',
                            fontWeight: 'bold',
                            borderBottomWidth: 1,
                            borderColor: '#8d8d8d20',
                            flex: 1,
                            paddingBottom: 24
                          }
                        ]}
                      >
                        <Text
                          style={[
                            TextStyle.normalText,
                            { color: '#8d8d8d', fontWeight: 'normal' }
                          ]}
                        >
                          {Number(player.goal) >= 100
                            ? 'The Champion'
                            : 'Finished '}
                        </Text>
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
            buttonStyle={[
              styles.button,
              { backgroundColor: '#ffc500', width: '30%', alignSelf: 'center' }
            ]}
            textStyle={[
              TextStyle.mediumText,
              { fontWeight: 'bold', color: '#534c5f' }
            ]}
          />
        </View>
      </FastImage>
    );
  };

  onPressFinish = this.onClickView(() => {
    this.replaceScreen(this.props.navigation, TAGCREATE);
  });

  renderMap = () => {
    const {
      user,
      room,
      isReady,
      playersMarker = [],
      isLoading = false
    } = this.state;
    const uriPhoto = room?.photo ? { uri: room?.photo } : images.image_start;
    const markersView = this.renderMarker();
    return (
      <GameLoop style={styles.map} onUpdate={this.updateHandler}>
        <ImageZoom
          cropWidth={this.sizeMap.width}
          cropHeight={heightScreen}
          imageWidth={this.widthMap}
          imageHeight={heightMap}
          minScale={1}
          enableCenterFocus={false}
          maxScale={2}
        >
          <FastImageView
            style={{ width: this.widthMap, height: heightMap }}
            resizeMode="contain"
            source={uriPhoto}
          >
            {playersMarker}
            {markersView}
          </FastImageView>
        </ImageZoom>

        {isReady || user?.id !== room.userId ? null : (
          <Animatable.View
            style={[
              {
                position: 'absolute',
                bottom: verticalScale(20)
              }
            ]}
            animation="tada"
            duration={1200}
            iterationDelay={1000}
            iterationCount="infinite"
            delay={3000}
            direction="normal"
          >
            <Button
              loading={isLoading}
              containerViewStyle={[styles.button]}
              title="Get ready"
              onPress={this.onPressReady}
              buttonStyle={[{ backgroundColor: 'transparent' }]}
              textStyle={[
                TextStyle.mediumText,
                { color: '#534c5f', fontWeight: 'bold' }
              ]}
            />
          </Animatable.View>
        )}
      </GameLoop>
    );
  };

  renderMarker = (pos = this.state.pos || this.posInit) => {
    return (
      <Image
        source={images.ic_racer1}
        resizeMode="center"
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          top: pos.y,
          left: pos.x,
          width: sizeIconRacing.width,
          height: sizeIconRacing.height,
          transform: [{ rotate: `${pos.rotate}rad` }]
        }}
      />
    );
  };

  onPressReady = this.onClickView(async () => {
    const { room } = this.state;
    if (room && room.session) {
      this.setState({ isLoading: true });
      const index = Util.getRandomInt(
        0,
        CONSTANT_MESSAGE.START_RACING.length - 1
      );
      this.readText(CONSTANT_MESSAGE.START_RACING[index]);

      await this.props.startRacing({ session: room.session });
      this.setState({ isLoading: false });
    }
  });

  componentWillUnmount() {
    super.componentWillUnmount();
    console.log(TAG, ' componentWillUnmount ok');
    // this.props.disconnectBluetooth();
    // this.roomDataPrefference?.off('value');
  }
  leftRoom = async () => {
    const { room } = this.state;
    await this.props.leftRoom({ session: room?.session });
  };
  onPressTestAddChanel = this.onClickView(async () => {
    this.pubnub.channelGroups.addChannels(
      {
        channels: ['HienTon'],
        channelGroup: this.chanelGroupRoomKey.PLAYERS
      },
      function(status) {
        if (status.error) {
          console.log(TAG, 'addChannels operation failed w/ status: ', status);
        } else {
          console.log(TAG, 'addChannels: Channel added to channel group');
        }
      }
    );
  });
  onPressTest = this.onClickView(async () => {
    this.pubnub.channelGroups.listChannels(
      {
        channelGroup: this.chanelGroupRoomKey.PLAYERS
      },
      function(status, response) {
        if (status.error) {
          console.log(TAG, 'listChannels operation failed w/ error:', status);
          return;
        }
        console.log(TAG, 'listChannels FRIENDLIST: ');
        response.channels.forEach(function(channel) {
          console.log(TAG, ' listChannels channels.forEach = ', channel);
        });
      }
    );

    // // Which Friends are online right now
    // this.pubnub.hereNow(
    //   this.roomDataPrefference.subscribe.channelGroups,
    //   function(status, response) {
    //     if (status.error) {
    //       console.log(TAG, 'hereNow operation failed w/ error:', status);
    //     } else {
    //       console.log(TAG, 'hereNow ONLINE NOW: ', response);
    //     }
    //   }
    // );
    // this.pubnub.history(
    //   {
    //     ...this.playerMeDataPrefference.history,
    //     ...{ channel: this.chanelGroupRoomKey.DETAIL }
    //   },
    //   function(status, response) {
    //     console.log(TAG, ' pubnub.history -begin - response = ', response);
    //   }
    // );
    this.pubnub.publish(
      {
        channel: 'HienTon',
        message: {
          Hienton: 'Test ne'
        },
        channelGroup: this.chanelGroupRoomKey.PLAYERS
      },
      (status, response) => {
        console.log(
          TAG,
          ' pubnub.publish -onStreamCreated -  begin -status = ',
          status
        );
      }
    );
  });
  onPressClose = this.onClickView(async () => {
    try {
      this.showLoadingAllScreen = true;
      this.pubnub.unsubscribeAll();
      // this.roomDataPrefference?.off('value');
      console.log(TAG, ' onPressClose call-left-room');
      await Util.excuteWithTimeout(this.leftRoom(), 5);
    } catch (error) {
    } finally {
      this.showLoadingAllScreen = false;
      this.replaceScreen(this.props.navigation, TAGCREATE);
    }
  });

  set showLoadingAllScreen(isShow) {
    this.setState({ isLoadingAllScreen: isShow });
  }

  render() {
    const {
      room,
      user,
      players = [],
      isLoadingAllScreen = false,
      playersColor = {}
    } = this.state;
    return (
      <View style={styles.container}>
        {this.renderMap()}
        <View style={{ alignItems: 'center' }}>
          <BikerProfile
            onStreamCreated={this.onStreamCreated}
            onStreamDestroyed={this.onStreamDestroyed}
            room={room}
            user={user}
            players={players}
            playersColor={playersColor}
          />
        </View>

        {icons.close({
          onPress: this.onPressClose,
          containerStyle: {
            position: 'absolute',
            top: 10,
            left: 10
          }
        })}
        {/* {icons.groupUser({
          onPress: this.onPressTestAddChanel,
          containerStyle: {
            position: 'absolute',
            top: 80,
            left: 10
          }
        })} */}
        {/* {icons.close({
          onPress: this.onPressTest,
          containerStyle: {
            position: 'absolute',
            top: 150,
            left: 10
          }
        })} */}
        {ViewUtil.CustomProgressBar({ visible: isLoadingAllScreen })}
        <PopupDialog
          width="70%"
          height={`${dialogPercentHeight * 100}%`}
          hasOverlay
          dialogStyle={{ backgroundColor: 'transparent', alignItems: 'center' }}
          dismissOnTouchOutside={false}
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
        >
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
