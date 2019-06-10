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
import { Header, Avatar } from 'react-native-elements';
import TextStyle from '@/utils/TextStyle';
import PropTypes from 'prop-types';
import images, { icons } from '@/assets';
import { connect } from 'react-redux';
import { getTopRacer } from '@/actions/UserAction';
import ItemTopRacer from '@/components/ItemTopRacer';
import _ from 'lodash';
import User from '@/models/User';
import styles from './styles';

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
          style={{ flexDirection: 'row', marginTop: 10 }}
          onPress={this.onPressBack}
        >
          <Image source={images.ic_backtop} style={{ width: 32, height: 32 }} />
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginHorizontal: 10,
                marginLeft: 20
              }
            ]}
          >
            Top 10 bikers around the world
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  iconImage = asset => {
    return <Image source={asset} style={{ alignSelf: 'center' }} />;
  };
  renderItem = ({ item, index }) => {
    const isMe = this.state.dataTopRacer.list[index]['is_me'] || false;
    let iconResult = (
      <Avatar
        rounded
        titleStyle={[
          TextStyle.mediumText,
          {
            color: 'white',
            fontWeight: 'bold'
          }
        ]}
        overlayContainerStyle={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderWidth: 0,
          borderColor: 'white'
        }}
        width={65}
        height={65}
        title={String(index + 1)}
        containerStyle={{ alignSelf: 'center' }}
      />
    );

    switch (index) {
      case 0:
        iconResult = this.iconImage(images.ic_gold_top);
        break;
      case 1:
        iconResult = this.iconImage(images.ic_sliver);
        break;
      case 2:
        iconResult = this.iconImage(images.ic_bronze);
        break;
      default:
    }
    return (
      <ItemTopRacer
        key={String(item.id)}
        dataItem={item}
        icon={iconResult}
        isMe={isMe}
      />
    );
  };
  render() {
    const { listRacers, isLoading = false } = this.state;
    return (
      <ImageBackground
        style={[styles.container]}
        source={images.background_top_race}
      >
        <View style={styles.container}>
          <Header
            backgroundColor="transparent"
            containerStyle={{ borderBottomWidth: 0 }}
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
