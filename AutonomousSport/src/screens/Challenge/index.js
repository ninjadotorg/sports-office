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
import { fetchUser } from '@/actions/UserAction';
import { leftRoom } from '@/actions/RoomAction';
import TextStyle from '@/utils/TextStyle';
export const TAG = 'ChallengeScreen';
// const dataTest = {
//   id: 1,
//   userId: 1,
//   createdAt: '2018-07-24T11:14:18+07:00',
//   updatedAt: '2018-07-24T11:14:18+07:00',
//   deletedAt: null,
//   name: '',
//   session:
//     '1_MX40NjE1NDQyMn5-MTUzMjQwNTY1ODI1NH5qVG5McnlvcjAxaE9IY01mdC9ya3NpTVR-fg',
//   token:
//     'T1==cGFydG5lcl9pZD00NjE1NDQyMiZzaWc9YTIxMGI3MDZhOTY0NTczNDFlMTEzODJmYTcwNTA1MjZiOTdlNmZmMjpzZXNzaW9uX2lkPTFfTVg0ME5qRTFORFF5TW41LU1UVXpNalF3TlRZMU9ESTFOSDVxVkc1TWNubHZjakF4YUU5SVkwMW1kQzl5YTNOcFRWUi1mZyZjcmVhdGVfdGltZT0xNTMyNDA1NjU4Jm5vbmNlPTk1MDI4NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMyNDkyMDU4',
//   win: 0
// };

class ChallengeScreen extends BaseScreen {
  // static navigationOptions = {
  //   title: 'Challenge'
  // };
  constructor(props) {
    super(props);
    const room: Room = new Room(props.navigation?.state.params);
    this.state = {
      room: room,
      user:{},
      isLoading:false
    };
   
  }

  componentDidMount() {
    this.props.getUser();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user,
        isLoading:false
      };
    }
    return null;
  }


  renderMap = () => {
    const { room } = this.state;
    
    return (
      <View style={styles.map}>
        <Image
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          source={{ uri: room?.photo || '' }}
        />
        <Button
          containerViewStyle={{
            position: 'absolute',
            width: 300,
            bottom: 10
          }}
          title="Get ready"
          buttonStyle={[styles.button,{backgroundColor:'#02BB4F'}]}
          textStyle={[TextStyle.mediumText,{fontWeight:'bold'}]}
        />
      </View>
    );

  };

  
  
  onPressClose = () => {
    const {room} = this.state;
    this.props.leftRoom({session:room.session});
    this.replaceScreen(this.props.navigation, TAGHOME);
  };

  render() {
    const { room,user } = this.state;
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
    closeRoom:state.room?.closeRoom
  }),
  { getUser: fetchUser,leftRoom }
)(ChallengeScreen);
