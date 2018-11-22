import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ViewUtil, { onClickView } from '@/utils/ViewUtil';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import ItemMap from '@/components/ItemMap';
import { fetchMap } from '@/actions/RoomAction';
import { TAG as TAGCHOOSE } from '@/screens/ChooseRound';

export const TAG = 'MapList';
const PAGE_SIZE = 10;
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
class MapList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      data: [],
      isFetching: false,
      refreshing: false,
      itemSelected: 0
    };
    this.page = 0;
    this.onEndReachedCalledDuringMomentum = true;
    this.listData = [];
  }

  componentDidMount() {
    this.handleRefresh();
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps?.mapList.list) !==
      JSON.stringify(this.state.data)
    ) {
      // console.log(
      //   TAG,
      //   ' componentWillReceiveProps - user = ',
      //   JSON.stringify(nextProps?.user)
      // );
      // this.fetchData();
      let data = nextProps?.mapList.list || [];
      data.sort(function(a, b) {
        return a.miles - b.miles;
      });
      this.page = 1;
      this.pagingData(data);
      console.log(TAG, ' componentWillReceiveProps length = ', data.length);
      this.setState({
        data: data,
        refreshing: false
      });
    }
  }

  handleRefresh = onClickView(() => {
    if (!this.state.refreshing) {
      this.setState({
        refreshing: true
      });
      this.props.fetchMap({ offset: 0, limit: 100 });
    }
  });

  handleLoadMore = onClickView(() => {
    const { data = [], refreshing = false } = this.state;
    if (
      !refreshing &&
      !this.onEndReachedCalledDuringMomentum &&
      this.listData.length < data.length
    ) {
      this.onEndReachedCalledDuringMomentum = true;
      this.page += 1;
      this.pagingData(data);
      this.setState({
        refreshing: false
      });
      console.log(TAG, ' handleLoadMore page = ', this.page);
    }
  });

  renderLoading = () => {
    return null;
  };

  renderHeader = () => {
    return null;
  };

  renderItem = ({ item, index }) => {
    const checked = String(this.state.itemSelected) === String(item.id);
    return (
      <ItemMap
        key={item.id}
        onItemSelected={itemId => {
          this.setState({
            itemSelected: itemId
          });
          this.props.navigation.navigate(TAGCHOOSE, item);

          // this.itemSelected = itemId;
        }}
        checked={checked}
        dataItem={item}
      />
    );
  };
  pagingData = (data = []) => {
    const numberOfItem = PAGE_SIZE * this.page;
    this.listData =
      data.length >= numberOfItem ? data.slice(0, numberOfItem) : data;
    console.log(TAG, ' pagingData ', this.listData);
    return this.listData;
  };
  render() {
    const { data, isFetching, refreshing } = this.state;
    return (
      <View style={[styles.container, {}]}>
        <FlatList
          horizontal
          style={[styles.list, {}]}
          ListHeaderComponent={this.renderHeader}
          data={this.listData}
          initialNumToRender={5}
          keyExtractor={item => String(item.id)}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderLoading}
        />
      </View>
    );
  }
}

MapList.propTypes = {
  fetchMap: PropTypes.func.isRequired
};

MapList.defaultProps = {};
export default compose(
  withNavigation,
  connect(
    state => ({ mapList: state.room.mapList }),
    { fetchMap }
  )
)(MapList);
