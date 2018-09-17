import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';

import { Button } from 'react-native-elements';
import styles from './styles';
import BikerProfile from '@/components/BikerProfile';
import Room from '@/models/Room';
import images, { icons } from '@/assets';
import { TAG as TAGHOME } from '@/screens/Home';
import { connect } from 'react-redux';
import { fetchUser,updateRacing } from '@/actions/UserAction';
import { leftRoom } from '@/actions/RoomAction';
import { connectAndPrepare, disconnectBluetooth } from '@/actions/RaceAction';
import TextStyle from '@/utils/TextStyle';
import {onClickView} from '@/utils/ViewUtil';
import firebase from 'react-native-firebase';
import {debounce} from 'lodash';

export const TAG = 'ChallengeScreen';
class ChallengeScreen extends BaseScreen {
  // static navigationOptions = {
  //   title: 'Challenge'
  // };
  constructor(props) {
    super(props);
    const room: Room = new Room(props.navigation?.state.params);
    this.state = {
      room: room,
      user: {},
      race: {},
      distanceRun :0,
      kcal:0,
      isLoading: false,
      isReady:false
    };

    this.pathKey = `games/race-rooms/${room?.session || ''}`;
    this.dataPrefference = firebase.database().ref(this.pathKey);
    
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
  //     console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
  //     return {
  //       user: nextProps.user,
  //       isLoading: false
  //     };
  //   } else if (
  //     JSON.stringify(nextProps?.race) !== JSON.stringify(prevState.race)
  //   ) {
  //     console.log(TAG, ' getDerivedStateFromProps - race = ', nextProps?.race);
  //     return {
  //       race: nextProps.race
  //     };
  //   }
  //   return null;
  // }

  UNSAFE_componentWillReceiveProps(nextProps){
    const {user,race,distanceRun = 0,room = {},isReady,kcal=0} = this.state;

    if (JSON.stringify(nextProps?.user) !== JSON.stringify(user)) {
      console.log(TAG, ' componentWillReceiveProps - user = ', nextProps?.user);
      this.setState({
        user: nextProps.user,
        isLoading: false
      },()=>{
        this.roomDataPrefference = this.dataPrefference.child('players').child(this.state.user.fbuid);
        this.props.connectAndPrepare();
      });
      
    } else if (
      JSON.stringify(nextProps?.race) !== JSON.stringify(race)
    ) {
      console.log(TAG, ' componentWillReceiveProps race begin ');
      const {race = {}} = nextProps;
      const {data} = race;
      console.log(TAG, ' componentWillReceiveProps race begin01 data = ',data);
      if(isReady && this.roomDataPrefference){
        const s = (distanceRun + data.distanceStreet)||0;
        const sumKcal = (kcal + data.kcal)||0;
        console.log(TAG, ' componentWillReceiveProps 01 - s = ', s);
        this.setState({
          race: race,
          distanceRun:s,
          kcal:sumKcal
        });
        // caculate goal
        const goal = Math.round(s*100 / room?.miles) || 0;
        console.log(TAG, ' componentWillReceiveProps02 - goal = ', goal);
        this.roomDataPrefference.update({
          speed:data.speed,
          goal:goal,
          kcal:sumKcal
        });

        // save local user
        this.saveUserInfo({kcal:data.kcal||0,miles: data.distanceStreet});
      }
    }
  }

  saveUserInfo = debounce(({kcal = 0,miles= 0})=>{
    console.log(TAG, ' saveUserInfo begin ');
    this.props.updateRacing({kcal,miles});    
  },1000);

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
    const { room,isReady } = this.state;

    return (
      <View style={styles.map}>
        <Image
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          source={{ uri: room?.photo || '' }}
        />
        {isReady?null:
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
        />}
      </View>
    );
  };

  onPressReady = onClickView(()=>{
    this.setState({isReady:true});
  });

  componentWillUnmount() {
    console.log(TAG, ' componentWillUnmount ok');
    this.props.disconnectBluetooth();

  }

  onPressClose = () => {
    const { room } = this.state;
    this.props.leftRoom({ session: room?.session });
    this.replaceScreen(this.props.navigation, TAGHOME);
  };

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
  { getUser: fetchUser,updateRacing, connectAndPrepare, leftRoom, disconnectBluetooth }
)(ChallengeScreen);
