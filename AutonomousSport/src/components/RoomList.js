import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import ItemRoom from '@/components/ItemRoom';
import { fetchRoom, joinRoom } from '@/actions/RoomAction';
import TextStyle, { screenSize } from '@/utils/TextStyle';
import images, { icons } from '@/assets';

import { verticalScale, moderateScale, scale } from 'react-native-size-matters';

export const TAG = 'RoomList';
const wp = percentage => {
  const value = (percentage * screenSize.width) / 100;
  return Math.round(value);
};

const slideWidth = wp(50);
const itemHorizontalMargin = wp(2);

export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export const sliderWidth = screenSize?.width || 100;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  containerImg: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Platform.OS === 'ios' ? 8 : 0,
    resizeMode: 'cover'
  },
  imageContainer: {
    borderRadius: 8,
    height: '100%',
    marginBottom: Platform.OS === 'ios' ? 0 : -1
  },
  imageIconNoroom: {
    alignItems: 'center',
    borderRadius: Platform.OS === 'ios' ? 8 : 0,
    justifyContent: 'center',
    resizeMode: 'cover'
  },
  item: {
    paddingVertical: 10
  },
  list: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-start'
  }
});
class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      data: [],
      dataFilter: [],
      isFetching: false,
      refreshing: false,
      itemSelected: {},
      joinRoom: undefined,
      levelFillter: { min: 0, max: 10 }
    };
  }

  componentDidMount() {
    this.props.fetchRoom({ offset: 0, limit: 100 });
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(
  //     TAG,
  //     ' getDerivedStateFromProps - prevState?.user =  ',
  //     prevState?.user
  //   );
  //   if (JSON.stringify(nextProps?.user) !== JSON.stringify(prevState.user)) {
  //     console.log(
  //       TAG,
  //       ' getDerivedStateFromProps - user = ',
  //       JSON.stringify(nextProps?.user)
  //     );
  //     return {
  //       user: nextProps.user
  //     };
  //   }
  //   return null;
  // }
  componentWillReceiveProps(nextProps) {
    const { data, joinRoom, levelFillter, itemSelected = {} } = this.state;
    const newData = nextProps?.roomList?.list || data;
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      //console.log(TAG, ' componentWillReceiveProps - room list ');
      this.updateListRoom(newData, nextProps.levelIndex);
    } else if (
      nextProps?.joinRoomData['token'] &&
      JSON.stringify(nextProps?.joinRoomData) !== JSON.stringify(joinRoom)
    ) {
      itemSelected['token'] = nextProps?.joinRoomData['token'];
      // console.log(
      //   TAG,
      //   ' componentWillReceiveProps - JoinRoom itemSelected ',
      //   itemSelected
      // );
      if (itemSelected?.session) {
        this.props.navigation.navigate(TAGCHALLENGE, itemSelected);
      }
    }

    //console.log(TAG, ' updateListRoom ', nextProps?.levelIndex, newData);
    if (nextProps?.levelIndex !== this.props.levelIndex) {
      this.updateListRoom(newData, nextProps.levelIndex);
    }
  }

  updateListRoom = (data = [], levelIndex = 0) => {
    let levelf = { min: 0, max: 10 };
    if (levelIndex == 0) {
      levelf = { min: 0, max: 10 };
    }
    if (levelIndex == 1) {
      levelf = { min: 10, max: 20 };
    }
    if (levelIndex == 2) {
      levelf = { min: 20, max: 50 };
    }
    if (levelIndex == 3) {
      levelf = { min: 50, max: 10000 };
    }

    data.sort(function(a, b) {
      return b.id - a.id;
    });

    const datal =
      data?.filter(
        room => room.miles <= levelf.max && room.miles >= levelf.min
      ) || [];

    this.setState({
      data: data,
      levelFillter: levelf,
      dataFilter: datal
    });
  };

  joinRoomSelect = item => {
    console.log('joinRoomSelect', item);
    if (item && item.session) {
      this.props.joinRoom({ session: item.session });
    }
  };
  handleRefresh = () => {
    return this.state.refreshing;
  };

  handleLoadMore = () => {};

  renderLoading = () => {
    if (!this.state.isFetching) return null;
    return ViewUtil.loadingComponent();
  };

  renderHeader = () => {
    return null;
  };
  renderEmpty = () => {
    return (
      <View style={[styles.containerImg, {}]}>
        <Image
          source={images.ic_norooms}
          style={[
            styles.imageIconNoroom,
            { resizeMode: 'cover', height: scale(48), width: scale(48) }
          ]}
        />
        <Text
          style={[
            TextStyle.smallText,
            TextStyle.buttonText,
            { marginTop: verticalScale(10), color: '#8A8398' }
          ]}
        >
          There are no rooms available
        </Text>
      </View>
    );
  };

  renderItem = ({ item, index }, parallaxProps) => {
    return (
      <ItemRoom
        key={item.id}
        onItemSelected={itemId => {
          if (item?.session) {
            // create token from session
            this.joinRoomSelect(item);
            this.setState({
              itemSelected: item
            });
          }
        }}
        parallaxProps={parallaxProps}
        dataItem={item}
      />
    );
  };

  render() {
    const { isFetching, dataFilter = [] } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          contentContainerStyle={styles.list}
          ListEmptyComponent={this.renderEmpty}
          ListHeaderComponent={this.renderHeader}
          data={dataFilter}
          initialNumToRender={5}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.7}
          onRefresh={this.handleRefresh}
          refreshing={isFetching}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderLoading}
        />
      </View>
    );
  }
}

RoomList.propTypes = {
  levelIndex: PropTypes.number.isRequired,
  fetchRoom: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired
};

RoomList.defaultProps = {};
export default compose(
  withNavigation,
  connect(
    state => ({
      roomList: state.room?.roomList,
      joinRoomData: state.room?.joinRoom
    }),
    { fetchRoom, joinRoom }
  )
)(RoomList);
