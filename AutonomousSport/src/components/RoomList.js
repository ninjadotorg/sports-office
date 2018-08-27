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
import { fetchRoom } from '@/actions/RoomAction';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { screenSize } from '@/utils/TextStyle';

export const TAG = 'RoomList';
const wp = percentage => {
  const value = (percentage * screenSize.width) / 100;
  return Math.round(value);
};
const slideHeight = screenSize?.height * 0.36;

const entryBorderRadius = 8;
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
    itemSelected: 0
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
    if (
      JSON.stringify(nextProps?.roomList.list) !==
      JSON.stringify(this.state.data)
    ) {
      console.log(TAG, ' componentWillReceiveProps - room list ');
      // this.fetchData();
      this.setState({
        data: nextProps?.roomList.list
      });
    }
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

  // fetchData = async () => {
  //   try {
  //     console.log(TAG, ' - fetchData - begin ');
  //     const roomList = await ApiService.getRoomList({ page: 1, page_size: 10 });
  //     console.log(TAG, ' - fetchData - roomList ', roomList);
  //     this.setState({
  //       data: roomList
  //     });
  //   } catch (e) {
  //     console.log(TAG, ' - fetchData - error ', e);
  //   }
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
    // const checked = String(this.state.itemSelected) === String(item.id);
    // console.log(
    //   TAG,
    //   ' renderItem = ' + item.id + ' itemSelected = ',
    //   this.state.itemSelected + ' checked = ' + checked
    // );
    return (
      <ItemRoom
        key={item.id}
        onItemSelected={itemId => {
          this.setState({
            itemSelected: itemId
          });
          // console.log(TAG, ' renderItem = ' + itemId);
          // this.itemSelected = itemId;
        }}
        parallaxProps={parallaxProps}
        // checked={checked}
        dataItem={item}
      />
    );
  };

  render() {
    const { data, isFetching } = this.state;
    return (
      <View style={styles.container}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          hasParallaxImages
          data={data}
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
    state => ({ roomList: state.room.roomList }),
    { fetchRoom }
  )
)(RoomList);
