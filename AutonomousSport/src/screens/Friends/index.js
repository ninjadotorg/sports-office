import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Header, SearchBar,Button, ButtonGroup } from 'react-native-elements';
import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import images, { icons } from '@/assets';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import ViewUtil from '@/utils/ViewUtil';
import ItemFriend from '@/components/ItemFriend';

import { TAG as CHALLENGENAME } from '@/screens/ChallengeName';
import { TAG as TAGHOME } from '@/screens/Home';
 
import { fetchAllUser,fetchAllFriend } from '@/actions/FriendAction';
import {connect} from 'react-redux';
import _ from 'lodash';
import User from '@/models/User';
import Util from '@/utils/Util';
import { updateName } from '@/actions/UserAction';
const limitRow = 24;
export const TAG = 'FriendsScreen';
const buttons = ['Your Friends', 'All The World'];
const ivitesbuttons = ['Skip', 'Next'];



class FriendsScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Friends'
    };
  };
  constructor(props) {
    super(props);
    
    const roomInfo = this.props.navigation.getParam('roomInfo') || null ;  
    const invitem = this.props.navigation.getParam('invitemode') || false ; 
     
    const sumMiles = this.props.navigation.getParam('miles')||0;
    const mapId = this.props.navigation.getParam('mapId')||-1;
    const loop = this.props.navigation.getParam('loop')||1;



    this.state = {
      selectedIndex: 0,
      selectedNextIndex:1,
      offset:0,
      limit:limitRow,
      friends:{},
      isLoading:false,
      listFriends:[],
      listFriendsIvite:[],
      search:'',
      inviteMode: invitem,
      roomInfo:roomInfo,
      checkinvitebtn:true,
      sumMiles:sumMiles,
      mapId:mapId,
      loop:loop,

    };

     
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if(JSON.stringify(nextProps?.friends) !== JSON.stringify(prevState?.friends)){
  //     console.log(TAG," getDerivedStateFromProps = ",nextProps?.friends);
      
  //     const listFriends = nextProps?.friends?.list?.map(item => {
  //       return new User(item);
  //     }) || [];
  //     return {
  //       friends:nextProps?.friends,
  //       listFriends:listFriends,
  //       offset:nextProps?.friends?.next?.offset||0,
  //       limit:nextProps?.friends?.next?.limit||limitRow,
  //       isLoading:false
  //     };
  //   };
  //   return null;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if(JSON.stringify(prevState?.friends) !== JSON.stringify(this.state?.friends)){
  //     console.log(TAG," componentDidUpdate = ",prevProps?.friends);
  //   }
  // }
  
  componentWillReceiveProps(nextProps){
    const {friends,listFriends = []} = this.state;
    console.log(TAG,' componentWillReceiveProps begin = ');
    
    if(!_.isEqualWith(nextProps?.friends,friends)){
      console.log(TAG,' componentWillReceiveProps01 = length ',listFriends.length);
      const listNew =  nextProps?.friends?.list||[];
      let listSum = _.unionBy(listNew,friends.list,'id');
      listSum = _.sortBy(listSum,'id').reverse();
      console.log(TAG,' componentWillReceiveProps02 = length ',listSum[1]);
      const listFriendsNew =   listSum.map(item => {
        return new User(item);
      }) || [];
      
      this.setState({
        friends:nextProps?.friends,
        listFriends:listFriendsNew,
        offset:nextProps?.friends?.next?.offset||0,
        limit:nextProps?.friends?.next?.limit||limitRow,
        isLoading:false
      });
    };
  }

  componentDidMount() {
    const {offset,limit} = this.state;
    this.props.fetchAllFriend({offset,limit});
  }

  updateIndex = selectedIndexItem => {
    let {selectedIndex,offset,limit} = this.state;
    if(selectedIndexItem !== selectedIndex){
      offset = 0;
      limit = limitRow;
      this.setState({ 
        selectedIndex:selectedIndexItem,
       },()=>{
        this.onRefreshData();
      });
    }
  };

  onPressNextGo = this.onClickView( () => {

    ///this.replaceScreen(this.props.navigation,CHALLENGENAME, {"roomInfo":this.state.roomInfo});
    //this.props.navigation.navigate(CHALLENGENAME,{"roomInfo":this.state.roomInfo});
    const {loop,mapId,sumMiles} = this.state;  

    this.props.navigation.navigate(CHALLENGENAME,{"invitemode":true, "mapId":mapId,"loop":loop,"miles":sumMiles});


  });
 


  handleQueryChange = search =>{
    
    this.setState(state => ({ ...state, search: search || "" }));
    let {isLoading,offset,limit} = this.state;
    if(!isLoading){
       offset = 0;
       this.fetchData({offset,limit,search});
    }
  };
   
 
  handleSearchCancel = () => this.handleQueryChange("");
  handleSearchClear = () => this.handleQueryChange("");

  // searchdata(text){
  //   this.setState({search:text});
  //   console.log(TAG,' searchdata begin',text);

  //   let {isLoading,offset,limit} = this.state;
  //   if(!isLoading){
  //     this.fetchData({offset,limit,text});
  //   }
  // }

  fetchData = ({offset,limit, search })=>{
    let {selectedIndex} = this.state;
    console.log(TAG,' fetchData begin');
    selectedIndex ===0? this.props.fetchAllFriend({offset,limit,search}):this.props.fetchAllUser({offset,limit,search});
  }
  onRefreshData = this.onClickView(()=>{
    let {isLoading,search} = this.state;
    console.log(TAG,' onRefreshData begin');
    if(!isLoading){
      this.setState({
        offset:0,
        friends:{},
        listFriends:[],
        limit :limitRow,
        isLoading:true,

      },()=>{
        this.fetchData({offset:0,limitRow,search});
      });
      
    }
  });
  onLoadMore = this.onClickView(()=>{
    console.log(TAG,' onLoadMore begin');
    let {isLoading,offset,limit,search} = this.state;
    if(!isLoading){
      this.fetchData({offset,limit,search});
    }
  });
  onPressBack = () => {
    this.props.navigation.goBack();
    // if(this.state.inviteMode){
    //   this.props.leftRoom({ session: this.state.roomInfo?.session });
    //   this.replaceScreen(this.props.navigation, TAGHOME);
    // }
  };
  renderLeftHeader = () => {
    return (
      <View style={[styles.topBar]}>
        <TouchableOpacity style={{flexDirection:'row'}} onPress={this.onPressBack}>
            <Image source={images.ic_backtop}  style={{width:32, height:32, marginTop:12 }}/>
            <Text
              style={[
                TextStyle.mediumText,
                {
                  color: 'white',
                  textAlignVertical: 'center',
                  marginHorizontal: 10,
                  marginLeft:20,
                }
              ]}
            >
            {this.state.inviteMode ? "Invite people" : "Explore the world"} 
            </Text>
          </TouchableOpacity>
        <SearchBar
          round
          onChangeText={this.handleQueryChange}
          onCancel={this.handleSearchCancel}
          onClear={this.handleSearchClear}
          value={this.state.search}
          icon={{ type: 'font-awesome', name: 'search' }}
          noIcon={true}
          containerStyle={{
            marginLeft:200,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            shadowColor: 'white',
            backgroundColor: 'transparent',
            flex: 1,
            borderWidth: 0,
            borderRadius:32, 
          }}
          placeholder="Find friend by email or name"
          placeholderTextColor="#AFAFB9"
          inputStyle={{paddingLeft:20, borderRadius:32,color:"#FFFFFF"}}
        />
      </View>
    );
  };

  getIdInviteFriend=(friendId)=>{
     console.log("select friendId",friendId);
     this.setState({ checkinvitebtn:false});
  }
 

  renderItem = ({item,index}) => {
    return <ItemFriend key={String(index)} dataItem={item} inviteMode={this.state.inviteMode} selectIdfn={this.getIdInviteFriend}/>;
  };


  renderbottomButton= () =>{
 
    return ( 

      <View style={styles.containerBottom}>
        <Button 
            title="Skip sending invitation"
            textStyle={[TextStyle.mediumText,{ fontWeight:'bold', color:'#02BB4F',backgroundColor: 'transparent'}]}
            buttonStyle={[styles.button]}
            onPress={this.onPressNextGo}
          />
          <Button 
            title="Send invitation and start"
            disabled={this.state.checkinvitebtn}
            textStyle={[TextStyle.mediumText,{fontWeight:'bold'}]}
            buttonStyle={[styles.button2]}
            onPress={this.onPressNextGo}
          />
        </View>

    );

  }
  renderTabButton = () => {
     
    const { selectedIndex } = this.state;
    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        textStyle={[TextStyle.normalText, styles.textStyleButton]}
        selectedTextStyle={[
          TextStyle.normalText,
          styles.selectedTextStyleButton
        ]}
        selectedButtonStyle={styles.selectedButtonStyle}
        containerStyle={styles.buttonGroup} 
      />
    );
  };
  render() {

    const {selectedIndex, listFriends,isLoading, inviteMode} = this.state;

    console.log("friendscreen", selectedIndex, listFriends,isLoading, inviteMode);

    return (
      <ImageBackground style={[styles.container, {paddingRight:40 }]}  source={images.backgroundx}> 

        <Header backgroundColor="transparent" outerContainerStyles={{borderBottomWidth:0,paddingTop:40}}>
          {this.renderLeftHeader()}
        </Header>

        <View style={[styles.containerTop,{marginLeft:40}]}>
          {this.renderTabButton()} 
        </View>
        {listFriends.length == 0  && selectedIndex ===0 ?  
          <View style={[styles.containerImg,{marginLeft:verticalScale(40), marginRight:verticalScale(10)}]}> 

              <Image
                  source={images.ic_no_friend_list}   
                  style={[styles.image, { resizeMode:  'cover' }]} 
              />
              <Text 
                style={[TextStyle.smallText, TextStyle.buttonText]}
              >
              You have no friends
              </Text>
          </View>
        : 
            <FlatList
              keyExtractor={item=>String(item.id)}
              style={[styles.list,{ marginLeft:verticalScale(44), paddingLeft:0, marginRight:verticalScale(10), paddingRight:0}]}
              refreshing={isLoading}
              onRefresh={this.onRefreshData}
              data={listFriends}
              onEndReachedThreshold={0.5}
              onEndReached={this.onLoadMore}
              renderItem={ this.renderItem  }
            /> 
        }
        {inviteMode ? 
          <View style={[styles.containerTop,{marginLeft:40}]}>
            {this.renderbottomButton()}
          </View> : this.initDialogInvite()}
         
      </ImageBackground>
    );
  }
}

FriendsScreen.propTypes = {};

FriendsScreen.defaultProps = {};
export default connect(
  state => ({
    friends:state.friend.friendList,
  }),
  {fetchAllUser,fetchAllFriend}
)(FriendsScreen);
