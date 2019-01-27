import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import TextStyle from '@/utils/TextStyle';
import { colors } from '@/assets';
import * as screens from '@/screens';
import Video from 'react-native-video';
import _ from 'lodash';
import Util from '@/utils/Util';
import { connect } from 'react-redux';
import CommandP2P from '@/models/CommandP2P';

const PracticeScreen = screens.PracticeScreen;
const TopRaceScreen = screens.TopRaceScreen;
export const TAG = 'HomeContainer';
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
    borderBottomWidth: 2.5,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    borderBottomColor: colors.main_red
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

  // componentWillUpdate(nextProps) {
  //   console.log(
  //     `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
  //   );
  // }

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
    const itemSelected = this.dataP2PReceive?.data || {};

    return (
      play && (
        <TouchableOpacity
          onPress={() => {
            // this.setState({ paused: !paused });
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
            poster={!play && itemSelected.imgThump}
            paused={!play}
            // onBuffer={this.onBuffer}
            // onError={this.videoError}
            style={[styles.containerVideo, {}]}
          />
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
