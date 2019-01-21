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
import styles, { iconPlay } from './styles';

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
        'https://r4---sn-i3beln76.googlevideo.com/videoplayback?expire=1547829182&ipbits=0&itag=22&ratebypass=yes&requiressl=yes&lmt=1542513605459710&signature=39E9669CD5E9C7BB6C738F0F49171882CECB3838.41901861F3A0024D313DE1C813F4AD7733BD71C0&txp=5431432&ei=XqtBXIOiCtjNgAPH67WwBg&pl=21&id=o-AN0l_lW1rq3yLeUnbC2wDwcFi2FKa0CZIXD47mzp_3ME&dur=597.217&fvip=4&source=youtube&sparams=dur,ei,expire,id,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,pl,ratebypass,requiressl,source&ip=115.146.126.68&key=cms1&c=WEB&mime=video/mp4&redirect_counter=1&rm=sn-i3blr76&req_id=f6a6d7ba06ada3ee&cms_redirect=yes&ipbypass=yes&mip=113.161.55.181&mm=31&mn=sn-i3beln76&ms=au&mt=1547807622&mv=m'
    },
    {
      title: 'Yoga',
      level: 'Intermediate',
      time: '12 min',
      imgThump:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZ6C0t9eA-bKz8lr_5qEadLIFycpGFzU6qE9J9Mh8hA7lofJE',
      link:
        'https://r4---sn-i3b7kn76.googlevideo.com/videoplayback?mime=video/mp4&dur=1555.481&txp=5531432&sparams=dur,ei,id,ip,ipbits,itag,lmt,mime,mm,mn,ms,mv,pl,ratebypass,requiressl,source,expire&requiressl=yes&expire=1547829650&itag=22&key=yt6&ipbits=0&ratebypass=yes&ip=115.146.126.68&source=youtube&mm=31,26&mn=sn-i3b7kn76,sn-npoe7nes&id=o-AOrUe_RmHr5h4p1rk6SEVx538R2fQulPC3_C8IhrbBQ0&ei=Mq1BXOrvM8GJgAOS-qnoBw&ms=au,onr&mt=1547807437&mv=u&pl=24&c=WEB&fvip=1&lmt=1538587220507974&signature=2D969673EAF602818C37725914D28E7DA4FFA8CD.E1BEF94E46D3A154C3AF8EB605161FFF287A5B3A'
    },
    {
      title: 'Runners Strength & Blance',
      level: 'Intermediate',
      time: '16 min',
      imgThump:
        'https://content.active.com/Assets/Active.com+Content+Site+Digital+Assets/Article+Image+Update/2017/Nov+25/Shoes+of+Trail+Runner-Carousel.jpg',
      link: 'https://www.youtube.com/watch?v=GLuyVc65N9I'
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

  renderItem = ({ item, index }) => {
    return (
      <ImageBackground
        style={styles.containerItem}
        source={{ uri: item.imgThump }}
      >
        {iconPlay(() => {
          console.log(TAG, ' renderItem = ' + item.link);
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
