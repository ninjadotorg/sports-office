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
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { TAG as INVITEFRIENDS } from '@/screens/Friends';
import { TAG as TAGHOME } from '@/screens/Home';
import Video from 'react-native-video';
import images, { icons, colors } from '@/assets';
import { verticalScale } from 'react-native-size-matters';
import _ from 'lodash';
import { sendMessage, isSuccessfulInitialize } from 'react-native-wifi-p2p';
import styles, { iconPlay } from './styles';
import CommandP2P, { COMMAND_P2P } from '@/models/CommandP2P';

export const TAG = 'DemandScreen';
const tempData = {
  data: [
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://www.yogajournal.com/.image/t_share/MTQ2MTgwNjcyNDk2MDg0NTEy/yoga-for-runners-girl-sunset-stock.jpg',
      link:
        'https://r1---sn-i3belne6.googlevideo.com/videoplayback?mv=m&mt=1548212262&ms=au,rdu&fvip=4&id=o-AFkD1nH46hFQoeopxuEBhLbwnOfGevxD1Q8GU_Xze--H&lsig=ALy0alEwRQIgRZ2_4GMf8zh5zFIexgmIV3i3WUZHyvMG_57H5tHqSp0CIQCXWWDnJ0ZiOCaJ22bDiuyInDBtRYtI5-9SIK_Dcuq2lw==&ratebypass=yes&mn=sn-i3belne6,sn-i3b7kn76&mm=31,29&ip=115.146.126.68&pl=24&expire=1548234013&dur=1555.481&initcwndbps=3270000&source=youtube&ei=vdhHXObVEseE4gK12rtY&sig=AOvmAUowRAIgfbdyv93HyZ16KrS0lAYWwIv5Jhn1oSnR4EZRrp2fdZ0CIEt6EH7_F1eh5fe__DMpzczy3GdV5hwb2M80Z6pS2_K3&requiressl=yes&c=WEB&lsparams=initcwndbps,mn,mm,pl,ms,mv&itag=22&mime=video/mp4&lmt=1538587220507974&sparams=expire,ei,ip,source,lmt,requiressl,ipbits,mime,itag,dur,ratebypass,id&txp=5531432&ipbits=0'
    },
    {
      title: 'Yoga',
      level: 'Intermediate',
      time: '12 min',
      imgThump:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ6C0t9eA-bKz8lr_5qEadLIFycpGFzU6qE9J9Mh8hA7lofJE',
      link:
        'https://r1---sn-i3belne6.googlevideo.com/videoplayback?mv=m&mt=1548212262&ms=au,rdu&fvip=4&id=o-AFkD1nH46hFQoeopxuEBhLbwnOfGevxD1Q8GU_Xze--H&lsig=ALy0alEwRQIgRZ2_4GMf8zh5zFIexgmIV3i3WUZHyvMG_57H5tHqSp0CIQCXWWDnJ0ZiOCaJ22bDiuyInDBtRYtI5-9SIK_Dcuq2lw==&ratebypass=yes&mn=sn-i3belne6,sn-i3b7kn76&mm=31,29&ip=115.146.126.68&pl=24&expire=1548234013&dur=1555.481&initcwndbps=3270000&source=youtube&ei=vdhHXObVEseE4gK12rtY&sig=AOvmAUowRAIgfbdyv93HyZ16KrS0lAYWwIv5Jhn1oSnR4EZRrp2fdZ0CIEt6EH7_F1eh5fe__DMpzczy3GdV5hwb2M80Z6pS2_K3&requiressl=yes&c=WEB&lsparams=initcwndbps,mn,mm,pl,ms,mv&itag=22&mime=video/mp4&lmt=1538587220507974&sparams=expire,ei,ip,source,lmt,requiressl,ipbits,mime,itag,dur,ratebypass,id&txp=5531432&ipbits=0'
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://content.active.com/Assets/Active.com+Content+Site+Digital+Assets/Article+Image+Update/2017/Nov+25/Shoes+of+Trail+Runner-Carousel.jpg',
      link:
        'https://r1---sn-i3belne6.googlevideo.com/videoplayback?mv=m&mt=1548212262&ms=au,rdu&fvip=4&id=o-AFkD1nH46hFQoeopxuEBhLbwnOfGevxD1Q8GU_Xze--H&lsig=ALy0alEwRQIgRZ2_4GMf8zh5zFIexgmIV3i3WUZHyvMG_57H5tHqSp0CIQCXWWDnJ0ZiOCaJ22bDiuyInDBtRYtI5-9SIK_Dcuq2lw==&ratebypass=yes&mn=sn-i3belne6,sn-i3b7kn76&mm=31,29&ip=115.146.126.68&pl=24&expire=1548234013&dur=1555.481&initcwndbps=3270000&source=youtube&ei=vdhHXObVEseE4gK12rtY&sig=AOvmAUowRAIgfbdyv93HyZ16KrS0lAYWwIv5Jhn1oSnR4EZRrp2fdZ0CIEt6EH7_F1eh5fe__DMpzczy3GdV5hwb2M80Z6pS2_K3&requiressl=yes&c=WEB&lsparams=initcwndbps,mn,mm,pl,ms,mv&itag=22&mime=video/mp4&lmt=1538587220507974&sparams=expire,ei,ip,source,lmt,requiressl,ipbits,mime,itag,dur,ratebypass,id&txp=5531432&ipbits=0'
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://cdn-ami-drupal.heartyhosting.com/sites/muscleandfitness.com/files/styles/full_node_image_1090x614/public/media/dumbbell-press-bench-man-workout-1109.jpg?itok=LJnrgpPv',
      link: 'https://www.youtube.com/watch?v=GLuyVc65N9I'
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://www.yogajournal.com/.image/t_share/MTQ2MTgwNjcyNDk2MDg0NTEy/yoga-for-runners-girl-sunset-stock.jpg',
      link: 'https://www.youtube.com/watch?v=GLuyVc65N9I'
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://www.yogajournal.com/.image/t_share/MTQ2MTgwNjcyNDk2MDg0NTEy/yoga-for-runners-girl-sunset-stock.jpg',
      link: 'https://www.youtube.com/watch?v=GLuyVc65N9I'
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
    if (!_.isEmpty(data) && isSuccessfulInitialize()) {
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
          if (!this.isMirror) {
            const commandObj = new CommandP2P(COMMAND_P2P.PLAY_VIDEO, {
              link: item.link
            });
            // send message
            this.sendingMessage(commandObj.toJSON());
            this.setState({ paused: !this.state.paused, itemSelected: item });
          }
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
              this.setState({ paused: !paused });
            }}
            style={styles.containerVideo}
          >
            <Video
              source={{ uri: itemSelected.link }}
              // source={{
              //   uri:
              //     'http://www.youtube.com/api/manifest/dash/id/bf5bb2419360daf1/source/youtube?as=fmp4_audio_clear,fmp4_sd_hd_clear&sparams=ip,ipbits,expire,source,id,as&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=51AF5F39AB0CEC3E5497CD9C900EBFEAECCCB5C7.8506521BFC350652163895D4C26DEE124209AA9E&key=ik0',
              //   type: 'mpd'
              // }}
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
