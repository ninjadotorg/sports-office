import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
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
  }
});
class RoomList extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    user: {},
    data: [],
    isFetching: false,
    refreshing: false,
    itemSelected: {},
    joinRoom: undefined,
    levelFillter: { min: 0, max: 10 }
  };
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
    const { data, joinRoom } = this.state;
    if (JSON.stringify(nextProps?.roomList?.list) !== JSON.stringify(data)) {
      console.log(TAG, ' componentWillReceiveProps - room list ');

      this.setState({
        data: nextProps?.roomList?.list
      });
    } else if (
      nextProps?.joinRoomData['token'] &&
      JSON.stringify(nextProps?.joinRoomData) !== JSON.stringify(joinRoom)
    ) {
      const { itemSelected = {} } = this.state;
      itemSelected['token'] = nextProps?.joinRoomData['token'];
      this.props.navigation.navigate(TAGCHALLENGE, itemSelected);
    }
    console.log('levelIndex', nextProps?.levelIndex);

    var levelf = { min: 0, max: 10 };
    if (nextProps?.levelIndex == 0) {
      levelf = { min: 0, max: 10 };
    }
    if (nextProps?.levelIndex == 1) {
      levelf = { min: 10, max: 20 };
    }
    if (nextProps?.levelIndex == 2) {
      levelf = { min: 20, max: 50 };
    }
    if (nextProps?.levelIndex == 3) {
      levelf = { min: 50, max: 10000 };
    }
    this.setState({
      levelFillter: levelf
    });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(
  //     TAG,
  //     ' componentDidUpdate - prevProps?.user =  ',
  //     prevProps?.user,
  //     ' user = ',
  //     this.props.user
  //   );
  //   if (JSON.stringify(prevState?.user) !== JSON.stringify(this.state.user)) {
  //     console.log(TAG, ' - componentDidUpdate - begin # ');
  //     this.fetchData();
  //   }
  // }

  // onPressItem = async (item: JSON) => {
  //   try {
  //     // console.log(TAG, ' - onPressItem - item ', item);
  //     const response = await ApiService.joinRoom({
  //       session: item?.session || ''
  //     });
  //     // console.log(TAG, ' - onPressItem - response ', response);
  //     if (!_.isEmpty(response) && _.has(response, 'token')) {
  //       console.log(TAG, ' - onPressItem - response111 ', response);
  //       item['token'] = response['token'];
  //       this.props.navigation?.navigate(TAGCHALLENGE, item);
  //     }
  //   } catch (error) {}
  // };

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
    const { data = [], levelFillter } = this.state;
    //fillter data....levelFillter
    const datal =
      data?.filter(
        room => room.miles <= levelFillter.max && room.miles >= levelFillter.min
      ) || [];
    console.log('levelIndex-rooms', datal);
    return (
      <View style={styles.container}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          hasParallaxImages
          data={datal}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          loop
        />
      </View>
    );
  }
}

RoomList.propTypes = {};

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
