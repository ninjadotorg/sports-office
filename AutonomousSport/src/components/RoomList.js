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
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import ItemRoom from '@/components/ItemRoom';
import { fetchRoom, joinRoom } from '@/actions/RoomAction';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { screenSize } from '@/utils/TextStyle';

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
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10
  },
  list: {
    flex: 1
  },
  item: {
    paddingVertical: 10
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? 8 : 0
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius
  },
  imageContainer: {
    height: '100%',
    marginBottom: Platform.OS === 'ios' ? 0 : -1,
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,
    borderRadius: 8
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
    const { data, joinRoom, levelFillter } = this.state;
    const newData = nextProps?.roomList?.list;
    if (JSON.stringify(newData) !== JSON.stringify(data)) {
      console.log(TAG, ' componentWillReceiveProps - room list ');

      this.updateListRoom(newData, nextProps.levelIndex);
    } else if (
      nextProps?.joinRoomData['token'] &&
      JSON.stringify(nextProps?.joinRoomData) !== JSON.stringify(joinRoom)
    ) {
      const { itemSelected = {} } = this.state;
      itemSelected['token'] = nextProps?.joinRoomData['token'];
      this.props.navigation.navigate(TAGCHALLENGE, itemSelected);
    }

    if (
      nextProps?.levelIndex &&
      nextProps?.levelIndex !== this.props.levelIndex
    ) {
      console.log(TAG, ' levelIndex ', nextProps?.levelIndex);
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

    const datal =
      data?.filter(
        room => room.miles <= levelf.max && room.miles >= levelf.min
      ) || [];

    datal.sort(function(a, b) {
      return b.id - a.id;
    });
    this.setState({
      data: data,
      levelFillter: levelf,
      dataFilter: datal
    });
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

  renderItem = ({ item, index }, parallaxProps) => {
    return (
      <ItemRoom
        key={item.id}
        onItemSelected={itemId => {
          if (item?.session) {
            // create token from session
            this.setState(
              {
                itemSelected: item
              },
              () => {
                this.props.joinRoom({ session: item.session });
              }
            );
          }
        }}
        parallaxProps={parallaxProps}
        dataItem={item}
      />
 
    );
  };

  render() {
    const { isFetching, dataFilter = [] } = this.state;
    // console.log('levelIndex-rooms', dataFilter);
    // return (
    //   <View style={styles.container}>
    //     {dataFilter?.length > 0 ? (
    //       <Carousel
    //         ref={c => {
    //           this._carousel = c;
    //         }}
    //         hasParallaxImages
    //         data={dataFilter}
    //         renderItem={this.renderItem}
    //         sliderWidth={sliderWidth}
    //         itemWidth={itemWidth}
    //         loop
    //       />
    //     ) : (
    //       <Image
    //         source={{
    //           uri:
    //             'https://images.pexels.com/photos/53040/pexels-photo-53040.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //         }}
    //         style={[styles.image, { resizeMode: 'cover' }]}
    //       />
    //     )}
    //   </View>
    // );
    return (
      <View style={styles.container}> 
          <FlatList
          horizontal
          style={[styles.list, {}]}
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
  levelIndex: PropTypes.number.isRequired
};

RoomList.defaultProps = {
  levelIndex: -1
};
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
