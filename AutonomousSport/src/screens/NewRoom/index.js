import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Button, Header, ButtonGroup } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from './styles';
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
    const { selectedIndex } = this.state;
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={this.onPressBack}
        >
          <Image
            source={images.ic_backtop}
            style={{ width: 32, height: 32, marginTop: 10 }}
          />
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginHorizontal: 10,
                marginLeft: 20,
                marginTop: 10
              }
            ]}
          >
            Choose map
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <ImageBackground style={[styles.container]} source={images.backgroundx}>
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            outerContainerStyles={{ borderBottomWidth: 0 }}
          >
            {this.renderLeftHeader()}
          </Header>

          <MapList />

          {/*<View style={styles.containerBottom}>
            <Button
              title="Next"
              textStyle={[
                TextStyle.mediumText,
                { fontWeight: 'bold', color: '#ffc500' }
              ]}
              buttonStyle={[styles.button]}
              onPress={this.onPressCreateRoom}
            />
          </View>*/}
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
