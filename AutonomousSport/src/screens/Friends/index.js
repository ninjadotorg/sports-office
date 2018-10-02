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
import { Header, SearchBar, ButtonGroup } from 'react-native-elements';
import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import ApiService from '@/services/ApiService';
import images, { icons } from '@/assets';
import { moderateScale, scale } from 'react-native-size-matters';
import ViewUtil from '@/utils/ViewUtil';
import ItemFriend from '@/components/ItemFriend';
import { fetchAllUser,fetchAllFriend } from '@/actions/FriendAction';
import {connect} from 'react-redux';
import _ from 'lodash';
import User from '@/models/User';
import Util from '@/utils/Util';
const limitRow = 24;
export const TAG = 'FriendsScreen';
const buttons = ['Your Friends', 'All The World'];
class FriendsScreen extends BaseScreen {
  static navigationOptions = navigation => {
    return {
      title: 'Friends'
    };
  };
  constructor(props) {
    super(props);
    
    const roomInfo = JSON.parse( this.props.navigation.getParam('roomInfo')||"" );
    console.log(TAG, "inviteMode",roomInfo);

    this.state = {
      selectedIndex: 0,
      offset:0,
      limit:limitRow,
      friends:{},
      isLoading:false,
      listFriends:[],
      search:'',
      inviteMode:false,
      roomInfo:roomInfo,
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
        isLoading:true
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
  };
  renderLeftHeader = () => {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity style={{flexDirection:'row'}} onPress={this.onPressBack}>
            {icons.back({
              containerStyle: { marginHorizontal: 0 }
            })}
            <Text
              style={[
                TextStyle.mediumText,
                {
                  color: 'white',
                  textAlignVertical: 'center',
                  marginHorizontal: 10
                }
              ]}
            >
              Explore the world
            </Text>
          </TouchableOpacity>
        <SearchBar
          round
          onChangeText={this.handleQueryChange}
          onCancel={this.handleSearchCancel}
          onClear={this.handleSearchClear}
          value={this.state.search}
          icon={{ type: 'font-awesome', name: 'search' }}
          containerStyle={{
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            shadowColor: 'white',
            backgroundColor: 'transparent',
            flex: 1,
            borderWidth: 0
          }}
          placeholder="Find friend by email or name"
        />
      </View>
    );
  };

  renderItem = ({item,index}) => {
    // console.log(TAG,' renderItem = ',item);
    return <ItemFriend key={String(index)} dataItem={item} />;
  };

  renderTabButton = () => {
    // const buttons = [{ element: component1 }, { element: component2 }];
    
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
    const {listFriends,isLoading} = this.state;
    return (
      <ImageBackground style={styles.container}>
        <Header backgroundColor="transparent">
          {this.renderLeftHeader()}
        </Header>
        <View style={styles.containerTop}>
          {this.renderTabButton()}
        </View>
        
        <FlatList
          keyExtractor={item=>String(item.id)}
          style={styles.list}
          refreshing={isLoading}
          onRefresh={this.onRefreshData}
          data={listFriends}
          onEndReachedThreshold={0.5}
          onEndReached={this.onLoadMore}
          renderItem={this.renderItem}
        />
        
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
