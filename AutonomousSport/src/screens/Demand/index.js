import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { SearchBar, Icon } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import TextStyle from '@/utils/TextStyle';

import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { TAG as INVITEFRIENDS } from '@/screens/Friends';
import { TAG as TAGHOME } from '@/screens/Home';
import Video from 'react-native-video';
import images, { icons, colors } from '@/assets';
import _ from 'lodash';
import { sendMessage, isSuccessfulInitialize } from 'react-native-wifi-p2p';
import styles, { iconPlay } from './styles';
import CommandP2P, { COMMAND_P2P } from '@/models/CommandP2P';

export const TAG = 'DemandScreen';
const rootLink = 'assets_';
const link =
  'http://www.youtube.com/api/manifest/dash/id/bf5bb2419360daf1/source/youtube?as=fmp4_audio_clear,fmp4_sd_hd_clear&sparams=ip,ipbits,expire,source,id,as&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=51AF5F39AB0CEC3E5497CD9C900EBFEAECCCB5C7.8506521BFC350652163895D4C26DEE124209AA9E&key=ik0';
const tempData = {
  data: [
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://www.yogajournal.com/.image/t_share/MTQ2MTgwNjcyNDk2MDg0NTEy/yoga-for-runners-girl-sunset-stock.jpg',
      link: rootLink + 'boxing'
    },
    {
      title: 'Yoga',
      level: 'Intermediate',
      time: '12 min',
      imgThump:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ6C0t9eA-bKz8lr_5qEadLIFycpGFzU6qE9J9Mh8hA7lofJE',
      link: rootLink + 'yoga'
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://content.active.com/Assets/Active.com+Content+Site+Digital+Assets/Article+Image+Update/2017/Nov+25/Shoes+of+Trail+Runner-Carousel.jpg',
      link: link
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://cdn-ami-drupal.heartyhosting.com/sites/muscleandfitness.com/files/styles/full_node_image_1090x614/public/media/dumbbell-press-bench-man-workout-1109.jpg?itok=LJnrgpPv',
      link: link
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://www.yogajournal.com/.image/t_share/MTQ2MTgwNjcyNDk2MDg0NTEy/yoga-for-runners-girl-sunset-stock.jpg',
      link: link
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://www.yogajournal.com/.image/t_share/MTQ2MTgwNjcyNDk2MDg0NTEy/yoga-for-runners-girl-sunset-stock.jpg',
      link: link
    }
  ]
};
class DemandScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      paused: true,
      dataCourses: tempData,
      error: '',
      isLoading: false,
      roomInfo: null,
      itemSelected: null
    };
  }

  get listCourses() {
    return this.state.dataCourses.data;
  }

  sendingMessage = (data = {}) => {
    if (!this.isMirror && !_.isEmpty(data) && isSuccessfulInitialize()) {
      sendMessage(JSON.stringify(data))
        .then(() => console.log('Message sent successfully'))
        .catch(err => console.log('Error while message sending', err));
    }
  };

  renderItem = ({ item, index }) => {
    return (
      <ImageBackground
        style={styles.containerItem}
        source={{ uri: item.imgThump }}
      >
        {iconPlay(() => {
          console.log(TAG, ' renderItem = ' + item.link);

          const commandObj = new CommandP2P(COMMAND_P2P.PLAY_VIDEO, item);
          // send message
          this.sendingMessage(commandObj.toJSON());
          this.setState({ paused: !this.state.paused, itemSelected: item });
        })}
        <View style={styles.containerBottom}>
          <Text
            style={[
              TextStyle.mediumText,
              {
                fontWeight: 'bold',
                color: colors.main_white
              }
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              TextStyle.smallText,
              {
                marginTop: 10,
                color: colors.main_white
              }
            ]}
          >
            {`${item.time} MIN - ${item.level}`}
          </Text>
        </View>
        {icons.dots({
          containerStyle: {
            position: 'absolute',
            bottom: 10,
            right: 10
          }
        })}
      </ImageBackground>
    );
  };

  componentDidMount() {}

  render() {
    const { isLoading = false, itemSelected, paused } = this.state;
    const styleContainer = paused
      ? styles.container
      : [styles.container, { opacity: 0.5, backgroundColor: 'transparent' }];
    return (
      <View style={styleContainer}>
        {paused && (
          <SearchBar
            onChangeText={this.handleQueryChange}
            onCancel={this.handleSearchCancel}
            onClear={this.handleSearchClear}
            icon={{
              type: 'font-awesome',
              name: 'search',
              style: {
                // marginTop: -7
              }
            }}
            containerStyle={{
              borderColor: '#e0e0e0',
              shadowColor: 'white',
              backgroundColor: '#f6f6f6',
              borderWidth: 1,
              borderRadius: 50,
              marginBottom: 10
            }}
            placeholder="Search..."
            placeholderTextColor="#262628"
            inputStyle={[
              TextStyle.mediumText,
              {
                fontStyle: 'italic',
                margin: 0,
                textAlignVertical: 'center',
                paddingLeft: 40,
                borderRadius: 50,
                height: 60,
                color: '#262628',
                backgroundColor: '#f6f6f6'
              }
            ]}
          />
        )}

        <FlatList
          keyExtractor={item => String(item.id)}
          style={[styles.list, paused ? {} : { display: 'none' }]}
          refreshing={isLoading}
          onRefresh={this.onRefreshData}
          data={this.listCourses}
          renderItem={this.renderItem}
        />
        {!paused && (
          <TouchableOpacity
            onPress={() => {
              const commandObj = new CommandP2P(
                COMMAND_P2P.PAUSE_VIDEO,
                this.state.itemSelected
              );
              this.sendingMessage(commandObj.toJSON());
              this.setState({ paused: !paused });
            }}
            style={styles.containerVideo}
          >
            <Video
              source={{ uri: itemSelected.link }}
              ref={ref => {
                this.player = ref;
              }}
              resizeMode="cover"
              posterResizeMode="cover"
              poster={paused && itemSelected.imgThump}
              paused={paused}
              // onBuffer={this.onBuffer}
              // onError={this.videoError}
              style={styles.containerVideo}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

DemandScreen.propTypes = {};

DemandScreen.defaultProps = {};

export default connect(
  state => ({}),
  {}
)(DemandScreen);
