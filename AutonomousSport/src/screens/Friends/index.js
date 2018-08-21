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
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import images, { icons } from '@/assets';
import { moderateScale, scale } from 'react-native-size-matters';
import ViewUtil from '@/utils/ViewUtil';
import ItemFriend from '@/components/ItemFriend';
import { fetchAllUser,fetchAllFriend } from '@/actions/FriendAction';
import {connect} from 'react-redux';
import User from '@/models/User';

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
    
    this.state = {
      selectedIndex: 0,
      offset:0,
      limit:12,
      friends:{},
      isLoading:false,
      listFriends:[]
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(JSON.stringify(nextProps?.friends) !== JSON.stringify(prevState?.friends)){
      // console.log(TAG," getDerivedStateFromProps = ",nextProps?.friends);
      
      const listFriends = nextProps?.friends?.list?.map(item => {
        return new User(item);
      }) || [];
      return {
        friends:nextProps?.friends,
        listFriends:listFriends,
        offset:nextProps?.friends?.next?.offset||0,
        limit:nextProps?.friends?.next?.limit||12
      };
    };
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(JSON.stringify(prevState?.friends) !== JSON.stringify(this.state?.friends)){
     
    }
  }
  
  

  componentDidMount() {
    const {offset,limit} = this.state;
    this.props.fetchAllFriend({offset,limit});
  }

  updateIndex = selectedIndexItem => {
    let {selectedIndex,offset,limit} = this.state;
    if(selectedIndexItem !== selectedIndex){
      offset = 0;
      this.setState({ selectedIndex:selectedIndexItem,offset },()=>{
        // selectedIndexItem ===0? this.props.fetchAllFriend({offset,limit}):this.props.fetchAllUser({offset,limit});
        this.onRefreshData();
      });
    }
  };
  fetchData = ({offset,limit})=>{
    let {selectedIndex} = this.state;
    selectedIndex ===0? this.props.fetchAllFriend({offset,limit}):this.props.fetchAllUser({offset,limit});
  }
  onRefreshData = ()=>{
    let {isLoading,limit} = this.state;
    if(!isLoading){
      this.setState({
        offset:0
      });
      this.fetchData({offset:0,limit});
    }
  }
  onLoadMore = ()=>{
    let {offset,limit} = this.state;
    this.fetchData({offset,limit});
  }
  onPressBack = () => {
    this.props.navigation.goBack();
  };
  renderLeftHeader = () => {
    return (
      <View style={styles.topBar}>
        {icons.back({
          containerStyle: { marginHorizontal: 0 },
          onPress: this.onPressBack
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
        <SearchBar
          round
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
    return <ItemFriend dataItem={item} />;
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
          onEndReachedThreshold={50}
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
    friends:state.friend?.friendList
  }),
  {fetchAllUser,fetchAllFriend}
)(FriendsScreen);
