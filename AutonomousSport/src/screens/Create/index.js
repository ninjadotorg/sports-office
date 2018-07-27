import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';

export const TAG = 'CreateRoomScreen';
export const DATA_MAP_LIST = [
  {
    title: 'Map 1',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    uri: 'https://i.imgur.com/UYiroysl.jpg'
  },
  {
    title: 'Map 2',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/UPrs1EWl.jpg'
  },
  {
    title: 'Map 3',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
    uri: 'https://i.imgur.com/MABUbpDl.jpg'
  },
  {
    title: 'Map 4',
    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
    uri: 'https://i.imgur.com/KZsmUi2l.jpg'
  },
  {
    title: 'Map 5',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/2nCt3Sbl.jpg'
  },
  {
    title: 'Map 6',
    subtitle: 'Lorem ipsum dolor sit amet',
    uri: 'https://i.imgur.com/lceHsT6l.jpg'
  }
];

export default class CreateRoomScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Create'
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      mapList: DATA_MAP_LIST
    };
  }

  componentDidMount() {}

  onPressCreateRoom = () => {
    try {
      const roomInfo = ApiService.createRoom();
    } catch (error) {
      
    }
  };
  renderItem = ({ item, index }, parallaxProps) => {
    const { uri = '', title = '' } = item || {};
    return (
      <TouchableOpacity
        style={[styles.slideInnerContainer, {}]}
        onPress={() => {
          alert(`You've clicked '${title}'`);
        }}
      >
        <TextInput
          style={styles.title}
          placeholder="Challenge me"
          defaultValue={title}
        />
        <ParallaxImage
          source={{ uri: uri }}
          containerStyle={[styles.imageContainer, {}]}
          style={[styles.image]}
          parallaxFactor={0.35}
          showSpinner
          spinnerColor="rgba(255, 255, 255, 0.4)"
          {...parallaxProps}
        />
        {/*<Image source={{ uri: uri }} style={styles.image} />*/}

        <TextInput
          style={styles.goal}
          placeholder="set goal"
          defaultValue="12km/h"
        />
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          hasParallaxImages
          data={this.state.mapList}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          loop
        />
        <Button
          title="Create"
          buttonStyle={styles.button}
          onPress={this.onPressCreateRoom}
        />
      </View>
    );
  }
}

CreateRoomScreen.propTypes = {};

CreateRoomScreen.defaultProps = {};
