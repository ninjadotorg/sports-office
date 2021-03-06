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
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import ItemMap from '@/components/ItemMap';
import { fetchMap } from '@/actions/RoomAction';
import { TAG as TAGCHOOSE } from '@/screens/ChooseRound';

export const TAG = 'MapList';
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
  }
  state = {
    user: {},
    data: [],
    isFetching: false,
    refreshing: false,
    itemSelected: 0
  };
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

  handleLoadMore = onClickView(() => {});

  renderLoading = () => {
    if (!this.state.isFetching) return null;
    return ViewUtil.loadingComponent();
  };

  renderHeader = () => {
    return null;
  };

  renderItem = ({ item, index }) => {
    const checked = String(this.state.itemSelected) === String(item.id);
    // console.log(
    //   TAG,
    //   ' renderItem = ' + item.id + ' itemSelected = ',
    //   this.state.itemSelected + ' checked = ' + checked
    // );
    return (
      <ItemMap
        key={item.id}
        onItemSelected={itemId => {
          this.setState({
            itemSelected: itemId
          });
          this.props.navigation.navigate(TAGCHOOSE, item);
          // console.log(TAG, ' renderItem = ' + itemId);
          // this.itemSelected = itemId;
        }}
        checked={checked}
        dataItem={item}
      />
    );
  };

  render() {
    const { data, isFetching, refreshing } = this.state;
    return (
      <View style={[styles.container, {}]}>
        <FlatList
          horizontal
          style={[styles.list, {}]}
          ListHeaderComponent={this.renderHeader}
          data={data}
          initialNumToRender={5}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.7}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderLoading}
        />
      </View>
    );
  }
}

MapList.propTypes = {};

MapList.defaultProps = {};
export default compose(
  withNavigation,
  connect(
    state => ({ mapList: state.room.mapList }),
    { fetchMap }
  )
)(MapList);
