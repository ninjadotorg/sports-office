import React, { Component } from 'react';
import { View, Text,ScrollView,StyleSheet } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
// import OTSubscriberViewCustom from '@/components/OTSubscriberViewCustom';
// var OTSubscriberView = require('node_modules/opentok-react-native/src/views/OTSubscriberView');
import firebase from 'react-native-firebase';
import _ from 'lodash';
import styles from './styles';
import Room from '@/models/Room';
import { Config } from '@/utils/Constants';
import Player from '@/models/Player';
import TextStyle from '@/utils/TextStyle';

export const TAG = 'BikerProfile';
class OTPublisherCustom extends OTPublisher{
  constructor(props) {
    super(props);
  }
  render(){
    const {playerMe = {}} = this.props;
    return (<View style={styles.parentViewInfo}>
              {super.render()}
              <View style={styles.parentViewPublishView}>
                <View style={styles.publisherInfo}>
                  <Text style={[TextStyle.normalText,{color:'white'}]}>{playerMe?.playerName||'No Name'}</Text>
                  <Text style={[TextStyle.normalText,{color:'white'}]}>{Math.round(playerMe?.speed||0)}m/h</Text>
                  <Text style={[TextStyle.normalText,{color:'white'}]}>{playerMe?.goal||0}%</Text>
                </View>    
              </View>
              
            </View>
            );
  }
}
class OTSubscriberCustom extends OTSubscriber{
  constructor(props){
    super(props);
    this.state = {
      players: props.players || [],
      streams:props.streams ||[]
    }
  }
  

  render() {
    const { streams = [],players = []} = this.state;
    let player = null;
    const length = streams?.length||0;
    const childrenWithStreams = streams?.map((streamId) => {
       // get player to show info
      //  console.log(TAG," render streamId = ",streamId);
      player = players.find(item=>item.streamId === streamId);
      return (<View key={streamId} style={[styles.subcriber,{flex:1,flexDirection:'column',justifyContent:'flex-end' }]}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical:10,
            backgroundColor: 'rgba(2,187,79,0.5)'
          }}
        >
          <Text style={[TextStyle.normalText,{color:'white'}]}>{player?.playerName||'No Name'}</Text>
          <Text style={[TextStyle.normalText,{color:'white'}]}>{player?.speed||0}km</Text>
          <Text style={[TextStyle.normalText,{color:'white'}]}>{player?.goal||0}%</Text>
        </View>
      </View>);
    });
    return (<View style={{backgroundColor:'transparent'}}>
      { super.render() } 
      <View style={[{
        flex:1,
        flexDirection: 'column',
        position: 'absolute',
        top:0,
        left: 0,
      
      }]}>{childrenWithStreams}</View>
  </View>);
  }
}
class BikerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      players: []
    };

    this.publisherEventHandlers = {
      streamCreated: event => {
        console.log(TAG,'Publisher stream created!', event);

        // push stream Id on firebase
        if(!_.isEmpty(event) && event.streamId){
          this.props.onStreamCreated(event.streamId);
        }

      },
      streamDestroyed: event => {
        console.log(TAG,'Publisher stream destroyed!', event);
        this.props.onStreamDestroyed(event?.streamId||'');
      }
    };
  }

  get room(): Room {
    return this.props?.room;
  }

  componentDidMount() {}


  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
      console.log(TAG, ' getDerivedStateFromProps - user = ', nextProps?.user);
      return {
        user: nextProps.user
      };
    }else if(!_.isEqual(nextProps?.players,prevState.players)){
      return {
        players: nextProps.players
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps?.user) !== JSON.stringify(this.state.user)) {
      console.log(TAG, ' componentDidUpdate - user = ', prevProps?.user);
    }
  }

  render() {
    const { players = [] } = this.state;
    const playerMe = players?.find(item=>item.isMe === true);
    console.log(TAG, ' render players = ',players );
    return (
      <ScrollView style={styles.container} contentContainerStyle={{flex:1}}>  
          <OTSession
            apiKey={Config.OPENTOK_API_KEY}
            sessionId={
              this.room?.session ||
              '1_MX40NjE1NDQyMn5-MTUzNTYyMTA2NzI4Nn5hczBrZzRzYXloQ3E4Z0N0aDZUM0pGNTV-fg'
            }
            token={
              this.room?.token ||
              'T1==cGFydG5lcl9pZD00NjE1NDQyMiZzaWc9YTE3YTNjMzE4OGE5OWYxM2FhMjZlYWU1OGEwZTE5ZmMxMmNiMDM4NzpzZXNzaW9uX2lkPTFfTVg0ME5qRTFORFF5TW41LU1UVXpOVFl5TVRBMk56STRObjVoY3pCclp6UnpZWGxvUTNFNFowTjBhRFpVTTBwR05UVi1mZyZjcmVhdGVfdGltZT0xNTM1NjIxMDY3Jm5vbmNlPTIzNDY4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTM1NzA3NDY3'
            }>
              <OTPublisherCustom playerMe={playerMe} style={styles.publisher} eventHandlers={this.publisherEventHandlers} />
            <View>
              <OTSubscriberCustom style={styles.subcriber} players={players} />
            </View>
          </OTSession>
      </ScrollView>
    );
  }
}

BikerProfile.propTypes = {};

BikerProfile.defaultProps = {};
export default BikerProfile;
