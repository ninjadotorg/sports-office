import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground
} from 'react-native';
import BaseScreen from '@/screens/BaseScreen';
import { Header } from 'react-native-elements';
import styles, { sliderWidth, itemWidth } from './styles';
import TextStyle from '@/utils/TextStyle';
import PropTypes from 'prop-types';
import images, { icons } from '@/assets';
import { connect } from 'react-redux';
import { getTopRacer } from '@/actions/UserAction';
import ItemTopRacer from '@/components/ItemTopRacer';
import _ from 'lodash';
import User from '@/models/User';

export const TAG = 'TopRaceScreen';

class TopRaceScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      dataTopRacer: undefined,
      listRacers: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.onRefreshData();
  }

  onRefreshData = this.onClickView(() => {
    let { isLoading } = this.state;
    console.log(TAG, ' onRefreshData begin');
    if (!isLoading) {
      this.setState({
        dataTopRacer: undefined,
        listRacers: [],
        isLoading: true
      });
      this.props.getTopRacer();
    }
  });

  componentWillReceiveProps(nextProps) {
    const { dataTopRacerUpdated = undefined } = nextProps || {};
    const { dataTopRacer } = this.state;
    if (!_.isEqual(dataTopRacerUpdated, dataTopRacer)) {
      const listRacers = (dataTopRacerUpdated.list || []).map(item => {
        return new User(item);
      });
      this.setState({
        dataTopRacer: dataTopRacerUpdated,
        listRacers: listRacers,
        isLoading: false
      });
    }
  }

  renderLeftHeader = () => {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={this.onPressBack}
        >
          <Image
            source={images.ic_backtop}
            style={{ width: 32, height: 32, marginTop: 10 }}
          />
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginHorizontal: 10,
                marginLeft: 20,
                marginTop: 10
              }
            ]}
          >
            Top 10 bikers around the world
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  renderItem = ({ item, index }) => {
    return <ItemTopRacer key={String(item.id)} dataItem={item} />;
  };
  render() {
    const { listRacers, isLoading = false } = this.state;
    return (
      <ImageBackground style={[styles.container]} source={images.backgroundx}>
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            outerContainerStyles={{ borderBottomWidth: 0 }}
          >
            {this.renderLeftHeader()}
          </Header>

          <FlatList
            keyExtractor={item => String(item.id)}
            style={[styles.list, {}]}
            refreshing={isLoading}
            onRefresh={this.onRefreshData}
            data={listRacers}
            renderItem={this.renderItem}
          />
          {this.initDialogInvite()}
        </View>
      </ImageBackground>
    );
  }
}

TopRaceScreen.propTypes = {
  getTopRacer: PropTypes.func.isRequired,
  dataTopRacer: PropTypes.object
};

TopRaceScreen.defaultProps = {
  dataTopRacer: {}
};
export default connect(
  state => ({
    dataTopRacerUpdated: state.user.topRacer
  }),
  { getTopRacer: getTopRacer }
)(TopRaceScreen);
