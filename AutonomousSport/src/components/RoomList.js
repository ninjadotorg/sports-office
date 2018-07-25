import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import ApiService from '@/services/ApiService';
import { TAG as TAGCHALLENGE } from '@/screens/Challenge';
import { withNavigation } from 'react-navigation';
import Room from '@/models/Room';

export const TAG = 'RoomList';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  list: {
    flex: 1
  }
});
class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isFetching: false,
      refreshing: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUpdate(nextProps) {
    console.log(
      `${TAG} - componentWillUpdate - nextProps = ${JSON.stringify(nextProps)} `
    );
  }

  onPressItem = item => {
    console.log(TAG, ' - onPressItem - item ', item);
    this.props.navigation?.navigate(TAGCHALLENGE,item);
  };

  fetchData = async () => {
    try {
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
    return (
      <View style={styles.container}>
        <FlatList
          style={[styles.list, {}]}
          removeClippedSubviews={false}
          ListHeaderComponent={this.renderHeader}
          data={this.state.data}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.7}
          onRefresh={this.handleRefresh}
          refreshing={this.state.isFetching}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderLoading}
        />
      </View>
    );
  }
}

RoomList.propTypes = {};

RoomList.defaultProps = {};
export default withNavigation(RoomList);
