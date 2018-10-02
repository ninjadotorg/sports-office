import React, { Component } from 'react';
import { View, Text,ScrollView,StyleSheet } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
// import OTSubscriberViewCustom from '@/components/OTSubscriberViewCustom';
// var OTSubscriberView = require('node_modules/opentok-react-native/src/views/OTSubscriberView');
// import firebase from 'react-native-firebase';
import _ from 'lodash';
import StyleBikeProfile from './styles';
import Room from '@/models/Room';
import { Config } from '@/utils/Constants';
// import Player from '@/models/Player';
import TextStyle from '@/utils/TextStyle';

export const TAG = 'BikerProfile';
class OTPublisherCustom extends OTPublisher{
  constructor(props) {
    super(props);
    console.log(TAG," OTPublisherCustom constructor begin");
    // const {playerMe = {}} = this.props||{};
    // console.log(TAG," OTPublisherCustom constructor begin01");
    // this.state = {
    //   playerMe:playerMe
    // };
    console.log(TAG," OTPublisherCustom constructor end");
  }
  // getDerivedStateFromProps(nextProps,prevState){
  //   console.log(TAG," getDerivedStateFromProps Publisher begin");
  //   if(JSON.stringify(nextProps.playerMe)!==JSON.stringify(prevState.playerMe) ){
  //     return {
  //       playerMe:nextProps.playerMe
  //     };
  //   }
  //   return null;
  // }
  // componentWillReceiveProps(nextProps){
    // super.componentWillReceiveProps(nextProps);
    // if(JSON.stringify(nextProps.playerMe)!==JSON.stringify(this.state.playerMe) ){
    //   this.setState({
    //     playerMe:nextProps.playerMe
    //   });
    // }
  // }
  render(){
    // const {playerMe = {}} = this.state;
    const {playerMe = {},styles} = this.props;
    
    return (<View style={styles.parentViewInfo}>
              {super.render()}
              <View style={styles.parentViewPublishView}>
                <View style={styles.publisherInfo}>
                  <Text style={[TextStyle.normalText,{color:'white'}]}>{playerMe?.playerName||'No Name'}</Text>
                  <Text style={[TextStyle.normalText,{color:'white'}]}>{Math.round(playerMe?.speed||0)}ml/h</Text>
                  <Text style={[TextStyle.normalText,{color:'white'}]}>{playerMe?.goal||0}%</Text>
                </View>    
              </View>
            </View>);
  }
}
class OTSubscriberCustom extends OTSubscriber{
  constructor(props){
    super(props);
    this.state = {
      streams:props.streams ||[]
    };
  }
  render() {
    const { streams = []} = this.state;
    
    const {styles,players = []}  = this.props;
    // console.log(TAG," render players length  = ",players.length);
    let player = null;
    // const length = streams?.length||0;
    const childrenWithStreams = streams?.map((streamId) => {
       // get player to show info
      // player = players.find(item=>{
      //   console.log(TAG," render streamId = ",streamId , " item = ",item.streamId);
      //   return item.streamId === streamId;
      // });
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
          <Text style={[TextStyle.normalText,{color:'white'}]}>{Math.round(player?.speed||0)}ml/h</Text>
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
      // user: {},
      players: props.players
    };

    const { width = 0, height = 1 } = this.room?.getMapSize()||{};
    
    this.styles= (new StyleBikeProfile({width,height})).getStyles();
    

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

  static isArrayEqual = (x, y) =>{
    return _(x).xorWith(y, _.isEqual).isEmpty();
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

  componentWillReceiveProps(nextProps){
    if(!BikerProfile.isArrayEqual(nextProps?.players,this.state.players)){
      console.log(TAG, ' componentWillReceiveProps - have player --- ',nextProps.players );
      this.setState({
        players: nextProps.players
      });
    }
    // console.log(TAG, ' componentWillReceiveProps - have player = ',nextProps.players);
    // this.setState({
    //   players: nextProps.players
    // });
  }

  render() {
    const { players = [] } = this.state;
    const playerMe = players?.find(item=>item.isMe === true);
    // console.log(TAG, ' render playerMe = ',playerMe );
    return (
      <ScrollView style={[this.styles.container,{height:'100%'}]} contentContainerStyle={{flex:1,flexGrow:1}}>  
          <OTSession
            apiKey={Config.OPENTOK_API_KEY}
            sessionId={
              this.room?.session ||''
            }
            token={
              this.room?.token || ''
            }>
              <OTPublisherCustom styles={this.styles} playerMe={playerMe} style={ this.styles.publisher} eventHandlers={this.publisherEventHandlers} />
            <View>
              <OTSubscriberCustom styles={this.styles} style={this.styles.subcriber} players={players} />
            </View>
          </OTSession>
      </ScrollView>
    );
  }
}

BikerProfile.propTypes = {};

BikerProfile.defaultProps = {};
export default BikerProfile;
