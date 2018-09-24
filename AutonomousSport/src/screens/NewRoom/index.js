import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
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

export const DATA_MAP_LIST = [
  {
    id:1,
    title: 'Map 1',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    uri: 'https://i.imgur.com/UYiroysl.jpg'
  },
  {
    id:2,
    title: 'Map 2',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/UPrs1EWl.jpg'
  },
  {
    id:3,
    title: 'Map 3',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
    uri: 'https://i.imgur.com/MABUbpDl.jpg'
  },
  {
    id:4,
    title: 'Map 4',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    uri: 'https://i.imgur.com/KZsmUi2l.jpg'
  },
  {
    id:5,
    title: 'Map 5',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/2nCt3Sbl.jpg'
  },
  {
    id:6,
    title: 'Map 6',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/lceHsT6l.jpg'
  }
];

class NewRoomScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      mapList: DATA_MAP_LIST,
      selectedIndex:0
    };
  }

  componentDidMount() {
    this.props.getUser();
  }

  onPressCreateRoom = async () => {
    try {
      const roomInfo = await ApiService.createRoom();
      console.log(TAG,' onPressCreateRoom roomInFo ' , roomInfo);
      if (roomInfo) {
        this.props.navigation.navigate(TAGCHALLENGE, roomInfo.toJSON());
      }
    } catch (error) {}
  };
  
  onPressBack = ()=>{
    this.props.navigation.goBack();
  }
  renderLeftHeader = () => {
    const { selectedIndex } = this.state;
    return (
      <TouchableOpacity style={styles.topBar} onPress={this.onPressBack}>
        {icons.back({
          containerStyle: { marginHorizontal: 0 }
        })}
        <Text
          style={[
            TextStyle.mediumText,
            {
              color: 'white',
              textAlignVertical: 'center',
              marginHorizontal: 10
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
      <View style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <MapList />
        <View style={styles.containerBottom}>
          <Button
            title="Next"
            textStyle={[TextStyle.mediumText,{fontWeight:'bold',color:'#02BB4F'}]}
            buttonStyle={[styles.button]}
            onPress={this.onPressCreateRoom}
          />
        </View>
      </View>
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