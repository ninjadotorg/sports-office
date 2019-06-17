import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Header } from 'react-native-elements';
import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import images, { icons } from '@/assets';
import MapList from '@/components/MapList';
import { connect } from 'react-redux';
import { fetchUser } from '@/actions/UserAction';

export const TAG = 'NewRoomScreen';

class NewRoomScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      mapList: [],
      selectedIndex: 0
    };
  }

  componentDidMount() {
    this.props.getUser();
  }

  onPressCreateRoom = async () => {
    try {
      const roomInfo = await ApiService.createRoom({
        mapId: -1,
        loop: 1,
        miles: 0
      });
      console.log(TAG, ' onPressCreateRoom roomInFo ', roomInfo);
      if (roomInfo) {
        this.props.navigation.navigate(TAGCHALLENGE, roomInfo.toJSON());
      }
    } catch (error) {}
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };
  renderLeftHeader = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={this.onPressBack}
      >
        <Image source={images.ic_backtop} style={{ width: 32, height: 32 }} />
        <Text
          style={[
            TextStyle.mediumText,
            {
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              marginLeft: 20
            }
          ]}
        >
          Choose map
        </Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <ImageBackground style={[styles.container]} source={images.backgroundx}>
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            leftContainerStyle={{ flex: 1 }}
            centerContainerStyle={{ flex: 0 }}
            rightContainerStyle={{ flex: 0 }}
            containerStyle={{ borderBottomWidth: 0 }}
          >
            {this.renderLeftHeader()}
          </Header>

          <MapList />
          {this.initDialogInvite()}
        </View>
      </ImageBackground>
    );
  }
}

NewRoomScreen.propTypes = {};

NewRoomScreen.defaultProps = {};
export default connect(
  state => ({
    user: state.user
  }),
  { getUser: fetchUser }
)(NewRoomScreen);
