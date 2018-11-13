import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import { scale } from 'react-native-size-matters';
import _ from 'lodash';
import StyleBikeProfile from './styles';
import images, { icons } from '@/assets';
import Room from '@/models/Room';
import { Config } from '@/utils/Constants';
// import Player from '@/models/Player';
import TextStyle from '@/utils/TextStyle';
import Util from '@/utils/Util';

export const TAG = 'BikerProfile';
const MAX_LENGHT = 7;
class OTPublisherCustom extends OTPublisher {
  constructor(props) {
    super(props);
    console.log(TAG, ' OTPublisherCustom constructor begin');
  }
 
  render() {
    // const {playerMe = {}} = this.state;
    const { playerMe = {}, styles } = this.props;

    return (
      <View style={styles.parentViewInfo}>
        {super.render()}
        <View style={styles.parentViewPublishView}>
          <View style={[styles.publisherInfo,{backgroundColor:'transparent'}]}>
            <View style={{flexDirection:'row',justifyContent:'center'}}>
              {icons.bike({
                containerStyle: { marginRight: scale(2) },
                color:'#00e751'
              })}
              <Text style={[TextStyle.normalText, { color: '#ffffff' ,fontWeight:'bold' }]}>
                {Util.truncate(playerMe?.playerName,MAX_LENGHT) || ''}
              </Text>
            </View>
            
            <Text style={[TextStyle.normalText, {  color: '#ffffff70' ,fontWeight:'bold' }]}>
              {Math.round(playerMe?.speed || 0)}
              mi/h
            </Text>
            <Text style={[TextStyle.normalText, {  color: '#ffffff70' ,fontWeight:'bold' }]}>
              {playerMe?.goal || 0}%
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
class OTSubscriberCustom extends OTSubscriber {
  constructor(props) {
    super(props);
    this.state = {
      streams: props.streams || []
    };
  }
  render() {
    const { streams = [] } = this.state;

    const { styles, players = [], playersColor = {} } = this.props;
    // console.log(TAG," render players length  = ",players.length);
    let player = null;
    // const length = streams?.length||0;
    const childrenWithStreams = streams?.map(streamId => {
      player = players.find(item => item.streamId === streamId);
      return (
        <View
          key={streamId}
          style={[
            styles.subcriber,
            { flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }
          ]}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 10,
              backgroundColor: 'transparent'
            }}
          >
            <View style={{flexDirection:'row',alignItems:"center"}}>
              <View
                style={{
                  backgroundColor: playersColor[player?.fbuid||'']||'transparent',
                  borderRadius: scale(7)/2,
                  width: scale(7),
                  height: scale(7),
                  marginRight: scale(2),
                  justifyContent: 'center'
                }}
              />
              <Text style={[TextStyle.normalText, {  color: '#ffffff' ,fontWeight:'bold'}]}>
              {Util.truncate(player?.playerName,MAX_LENGHT) || ''}
              </Text>
            </View>

            <Text style={[TextStyle.normalText, {  color: '#ffffff70' ,fontWeight:'bold' }]}>
              {Math.round(player?.speed || 0)}
              mi/h
            </Text>
            <Text style={[TextStyle.normalText, {  color: '#ffffff70' ,fontWeight:'bold' }]}>
              {player?.goal || 0}
%
            </Text>
          </View>
        </View>
      );
    });
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        {super.render()}
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'column',
              position: 'absolute',
              top: 0,
              left: 0
            }
          ]}
        >
          {childrenWithStreams}
        </View>
      </View>
    );
  }
}
class BikerProfile extends Component {
  constructor(props) {
    super(props);
    this.publisherProperties = {
      publishAudio: true,
      cameraPosition: 'front',
      resolution: '352x288'
    };
    this.state = {
      // user: {},
      players: props.players,
      playersColor: props.playersColor
    };

    const { width = 0, height = 1 } = this.room?.getMapSize() || {};

    this.styles = new StyleBikeProfile({ width, height }).getStyles();

    this.publisherEventHandlers = {
      streamCreated: event => {
        console.log(TAG, ' Publisher stream created!', event);

        // push stream Id on firebase
        if (!_.isEmpty(event) && event.streamId) {
          this.props.onStreamCreated(event.streamId);
        }
      },
      streamDestroyed: event => {
        console.log(TAG, ' Publisher stream destroyed!', event);
        this.props.onStreamDestroyed(event?.streamId || '');
      }
    };
  }

  get room(): Room {
    return this.props?.room;
  }

  componentDidMount() {}

  static isArrayEqual = (x, y) => {
    return _(x)
      .xorWith(y, _.isEqual)
      .isEmpty();
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
  //     console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
  //     return {
  //       user: nextProps.user
  //     };
  //   }else if(!_.isEqual(nextProps?.players,prevState.players)){
  //     console.log(TAG, ' getDerivedStateFromProps - have player');
  //     return {
  //       players: nextProps.players
  //     };
  //   }
  // if(!BikerProfile.isArrayEqual(nextProps?.players,prevState.players)){
  //   console.log(TAG, ' getDerivedStateFromProps - have player');
  //   return {
  //     players: nextProps.players
  //   };
  // }
  // console.log(TAG, ' getDerivedStateFromProps - have player',nextProps.players);
  // return null;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (JSON.stringify(prevProps?.user) !== JSON.stringify(this.state.user)) {
  //     console.log(TAG, ' componentDidUpdate - user = ', prevProps?.user);
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (!BikerProfile.isArrayEqual(nextProps?.players, this.state.players)) {
      console.log(
        TAG,
        ' componentWillReceiveProps - have player --- ',
        nextProps.players
      );
      this.setState({
        players: nextProps.players,
        playersColor: nextProps.playersColor
      });
    }
    // console.log(TAG, ' componentWillReceiveProps - have player = ',nextProps.players);
    // this.setState({
    //   players: nextProps.players
    // });
  }
  

  render() {
    const { players = [], playersColor = {} } = this.state;
    const playerMe = players?.find(item => item.isMe === true);
    // console.log(TAG, ' render playerMe = ',playerMe );
    return (
      <ScrollView
        style={[this.styles.container, { height: '100%' }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <OTSession
          apiKey={Config.OPENTOK_API_KEY}
          sessionId={this.room?.session || ''}
          token={this.room?.token || ''}
        >
          <OTPublisherCustom
            properties={this.publisherProperties}
            styles={this.styles}
            playerMe={playerMe}
            style={this.styles.publisher}
            eventHandlers={this.publisherEventHandlers}
          />
          <View>
            <OTSubscriberCustom
              styles={this.styles}
              style={this.styles.subcriber}
              players={players}
              playersColor={playersColor}
            />
          </View>
        </OTSession>
      </ScrollView>
    );
  }
}

BikerProfile.propTypes = {};

BikerProfile.defaultProps = {};
export default BikerProfile;
