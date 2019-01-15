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
import images, { icons, colors } from '@/assets';
import { connect } from 'react-redux';
import { getTopRacer } from '@/actions/UserAction';
import ItemTopRacer from '@/components/ItemTopRacer';
import _ from 'lodash';
import User from '@/models/User';
import { scale } from 'react-native-size-matters';
import styles, { sliderWidth, itemWidth } from './styles';

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

  iconImage = asset => {
    return <Image source={asset} style={{ alignSelf: 'center' }} />;
  };
  renderItem = ({ item, index }) => {
    const isMe = this.state.dataTopRacer.list[index]['is_me'] || false;
    let iconResult = (
      <Avatar
        rounded
        titleStyle={[
          TextStyle.smallText,
          {
            color: 'white',
            fontWeight: 'bold'
          }
        ]}
        overlayContainerStyle={{
          backgroundColor: '#120f12',
          borderWidth: 0,
          borderColor: 'white'
        }}
        width={30}
        height={30}
        title={String(index + 1)}
        containerStyle={{ alignSelf: 'center' }}
      />
    );

    // switch (index) {
    //   case 0:
    //     iconResult = this.iconImage(images.ic_gold_top);
    //     break;
    //   case 1:
    //     iconResult = this.iconImage(images.ic_sliver);
    //     break;
    //   case 2:
    //     iconResult = this.iconImage(images.ic_bronze);
    //     break;
    //   default:
    // }
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
          <View style={styles.containerTop}>
            <Text
              style={[
                TextStyle.xxExtraText,
                styles.textStyleButton,
                { fontWeight: 'bold' }
              ]}
            >
              Phillip Gardner
            </Text>
            <Text style={[TextStyle.mediumText, styles.textStyleButton]}>
              287 Kcal
            </Text>
          </View>

          <FlatList
            keyExtractor={item => String(item.id)}
            style={[styles.list, {}]}
            refreshing={isLoading}
            onRefresh={this.onRefreshData}
            data={listRacers}
            renderItem={this.renderItem}
          />
        </View>
        {this.initDialogInvite()}
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
