import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import images, { colors, videos } from '@/assets';
import * as screens from '@/screens';
import Video from 'react-native-video';
import _ from 'lodash';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';
import Util from '@/utils/Util';
import { connect } from 'react-redux';
import CommandP2P from '@/models/CommandP2P';
import LinearGradient from 'react-native-linear-gradient';

const PracticeScreen = screens.PracticeScreen;
const TopRaceScreen = screens.TopRaceScreen;
export const TAG = 'HomeContainer';
const marginParentChild = 10;
const widthContainerBottom = screenSize.width - marginParentChild * 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  textStyleButton: {
    fontWeight: 'bold',
    color: colors.text_main_black_disable
  },
  containerVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  containerTop: {
    paddingBottom: scaleSize(30),
    paddingTop: scaleSize(15),
    flexDirection: 'column'
  },
  containerBottom: {
    height: widthContainerBottom / 5,
    paddingHorizontal: marginParentChild,
    width: screenSize.width,
    position: 'absolute',
    bottom: 0
  },
  selectedTextStyleButton: {
    fontWeight: 'bold',
    color: colors.text_main_black
  },
  buttonGroup: {
    borderColor: 'transparent',
    shadowColor: 'transparent',
    backgroundColor: colors.main_white,
    borderWidth: 0
  },
  buttonItemStyle: {
    paddingVertical: 15,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  selectedButtonStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2.5,
    shadowColor: 'transparent',
    borderBottomColor: colors.main_red
  },
  label: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: scaleSize(20),
    borderWidth: 1,
    borderColor: 'transparent',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // height: scaleSize(20),
    minWidth: scaleSize(70),
    paddingVertical: scaleSize(4)
  },
  labelText: {
    fontWeight: '500',
    marginRight: 15,
    textAlignVertical: 'center',
    color: 'white'
  },
  labelImage: {
    position: 'absolute',
    left: 0,
    alignSelf: 'center',
    resizeMode: 'cover',
    height: scaleSize(18),
    width: scaleSize(18)
  }
});
class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      p2pMessage: undefined
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state.p2pMessage, nextProps.p2pMessage)) {
      console.log('componentWillReceiveProps OOKKK');
      const { command = {} } = nextProps.p2pMessage;
      this.dataP2PReceive = !_.isEmpty(command)
        ? new CommandP2P(command.action, command.data)
        : null;
      this.setState({
        p2pMessage: nextProps.p2pMessage
      });
    }
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
    console.log('updateIndex-levelIndex', selectedIndex);
  };

  renderDetailOnMirror = () => {
    // const pause = this.dataP2PReceive?.isPauseVideo() || false;
    const play =
      (this.dataP2PReceive?.isPlayVideo() &&
        !this.dataP2PReceive?.isPauseVideo()) ||
      false;
    const itemSelected = this.dataP2PReceive?.data || { link: '' };
    let linkData = itemSelected?.link || '';
    const isLinkLocal = _.includes(linkData, 'assets_');
    linkData = (isLinkLocal ? linkData.split('_')[1] : linkData) || '';
    const sourceLinkVideo = isLinkLocal ? videos[linkData] : { uri: linkData };

    return (
      play && (
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.containerVideo, {}]}
        >
          <Video
            source={sourceLinkVideo}
            ref={ref => {
              this.player = ref;
            }}
            resizeMode="cover"
            posterResizeMode="cover"
            poster={!play && itemSelected.imgThump}
            paused={!play}
            style={[styles.containerVideo, {}]}
          />
          <LinearGradient
            colors={['#1f1f1f', 'rgba(31, 31, 31, 0)']}
            style={styles.containerTop}
          >
            <View
              style={{
                flexDirection: 'row',
                width: '60%',
                justifyContent: 'space-around',
                alignSelf: 'center'
              }}
            >
              <TouchableOpacity style={styles.label}>
                <Image source={images.ic_like} style={[styles.labelImage]} />
                <Text style={[TextStyle.smallText, styles.labelText]}>
                  127 BPM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.label}>
                <Image source={images.ic_battery} style={[styles.labelImage]} />
                <Text style={[TextStyle.smallText, styles.labelText]}>
                  520 Kcal
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(31, 31, 31, 0)', '#1f1f1f']}
            style={styles.containerBottom}
          >
            <ImageBackground
              source={images.background_detail_bottom}
              style={{ width: '100%', height: '100%' }}
            />
          </LinearGradient>
        </TouchableOpacity>
      )
    );
  };

  render() {
    const { selectedIndex } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <SegmentedControlTab
          values={['User progress', 'Leaderboard']}
          selectedIndex={selectedIndex}
          onTabPress={this.updateIndex}
          tabsContainerStyle={[
            styles.buttonGroup,
            Util.isMirror() ? { display: 'none' } : {}
          ]}
          tabStyle={styles.buttonItemStyle}
          tabTextStyle={[TextStyle.mediumText, styles.textStyleButton]}
          activeTabStyle={styles.selectedButtonStyle}
          activeTabTextStyle={[
            TextStyle.mediumText,
            styles.selectedTextStyleButton
          ]}
          borderRadius={0}
        />

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'transparent'
          }}
        >
          {selectedIndex === 0 ? <PracticeScreen /> : <TopRaceScreen />}
          {Util.isMirror() && this.renderDetailOnMirror()}
        </View>
      </View>
    );
  }
}

HomeContainer.propTypes = {};

export default connect(
  state => ({
    p2pMessage: state.p2p
  }),
  {}
)(HomeContainer);
