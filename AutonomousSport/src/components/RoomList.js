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

export const TAG = 'RoomList';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    refreshing: false
  };
  componentDidMount() {}
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
    if (JSON.stringify(nextProps?.user) !== JSON.stringify(this.state.user)) {
      console.log(
        TAG,
        ' componentWillReceiveProps - user = ',
        JSON.stringify(nextProps?.user)
      );
      this.fetchData();
      this.setState({
        user: nextProps.user
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

  onPressItem = async (item: JSON) => {
    try {
      // console.log(TAG, ' - onPressItem - item ', item);
      const response = await ApiService.joinRoom({
        session: item?.session || ''
      });
      // console.log(TAG, ' - onPressItem - response ', response);
      if (!_.isEmpty(response) && _.has(response, 'token')) {
        console.log(TAG, ' - onPressItem - response111 ', response);
        item['token'] = response['token'];
        this.props.navigation?.navigate(TAGCHALLENGE, item);
      }
    } catch (error) {}
  };

  fetchData = async () => {
    try {
      console.log(TAG, ' - fetchData - begin ');
      const roomList = await ApiService.getRoomList({ page: 1, page_size: 10 });
      console.log(TAG, ' - fetchData - roomList ', roomList);
      this.setState({
        data: roomList
      });
    } catch (e) {
      console.log(TAG, ' - fetchData - error ', e);
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

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        key={String(item.id)}
        onPress={onClickView(() => {
          this.onPressItem(item);
        })}
      >
        <Text>
          {item.createdAt}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { data, isFetching } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={[styles.list, {}]}
          removeClippedSubviews={false}
          ListHeaderComponent={this.renderHeader}
          data={data}
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

RoomList.propTypes = {};

RoomList.defaultProps = {};
export default compose(
  withNavigation,
  connect(
    state => ({ user: state.user }),
    {}
  )
)(RoomList);
// export default connect(
//   state => ({ user: state.user }),
//   {}
// )(RoomList);
