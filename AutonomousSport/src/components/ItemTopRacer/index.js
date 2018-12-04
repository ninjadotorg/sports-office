import React, { PureComponent } from 'react';
import { View, Text, Image } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import {
  verticalScale,
  scale as horizontalScale,
  scale
} from 'react-native-size-matters';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './styles';
import TextStyle from '@/utils/TextStyle';
import User from '@/models/User';
import { makeFriend } from '@/actions/FriendAction';
import { onClickView } from '@/utils/ViewUtil';
import _ from 'lodash';
import images from '@/assets';

export const TAG = 'ItemTopRacer';

class ItemTopRacer extends PureComponent {
  constructor(props) {
    super(props);
    var dataItem = props.dataItem || {};
    this.state = {
      isLoading: false,
      dataItem: dataItem
    };
  }
  componentDidMount() {}

  onClickMakeFriend = onClickView(() => {
    const { dataItem, makeFriend} = this.props;
    // console.log('invited onClickMakeFriend', dataItem);
    if (dataItem?.id && !dataItem['is_maked_friend']) {
      this.setState({
        isLoading: true
      });
      makeFriend({ friendId: dataItem?.id });
    }
  });

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(TAG, ' componentWillReceiveProps begin = ', nextProps.dataItem);
    if (
      !_.isEmpty(nextProps.dataItem) &&
      JSON.stringify(nextProps.dataItem) !== JSON.stringify(this.state.dataItem)
    ) {
      this.setState({
        dataItem: nextProps.dataItem || {},
        isLoading: false
      });
    }
  }

  render() {
    const { dataItem, isLoading } = this.state;
    const {icon,isMe} = this.props;
    const mile = Math.ceil(dataItem.Profile.miles || 0);
    return (
      <View style={[styles.container, {}]}>
        {icon}
        <View
          style={{
            marginHorizontal: horizontalScale(10),
            flex: 1,
            justifyContent: 'center',
            marginLeft: verticalScale(20)
          }}
        >
          <Text
            style={[
              TextStyle.mediumText,
              {
                color: 'white',
                textAlignVertical: 'center'
              }
            ]}
          >
            {dataItem?.fullname || dataItem?.email || ''}
          </Text>
          <Text
            style={[
              TextStyle.normalText,
              {
                color: 'rgba(255,255,255,0.5)',
                textAlignVertical: 'center',
                paddingTop: 2
              }
            ]}
          >
            {`${mile} ${dataItem.textRouteUnit}${mile > 1 ? 's' : ''} `}
-
            {` ${Math.ceil(dataItem.Profile.kcal || 0)} Kcal`}
          </Text>
        </View>

        {!isMe?(<Button
          loading={isLoading}
          containerViewStyle={{
            marginRight: 0,
            borderRadius: scale(30),
            borderWidth: 1,
            borderColor: dataItem?.is_maked_friend ? '#76717f' : 'transparent',
            backgroundColor: dataItem?.is_maked_friend
              ? 'transparent'
              : '#ffc500',
            height: 45,
            minWidth: scale(80),
            alignSelf: 'center',
            justifyContent: 'center'
          }}
          textStyle={[
            TextStyle.normalText,
            {
              color: dataItem?.is_maked_friend ? 'white' : '#544e60'
            }
          ]}
          buttonStyle={{ backgroundColor: 'transparent' }}
          title={dataItem?.is_maked_friend ? 'Friend' : 'Add Friend'}
          onPress={this.onClickMakeFriend}
          rightIcon={
            dataItem?.is_maked_friend
              ? { name: 'ios-checkmark', type: 'ionicon' }
              : undefined
          }
        />):null}
      </View>
    );
  }
}

ItemTopRacer.propTypes = {
  dataItem: PropTypes.instanceOf(User).isRequired,
  icon: PropTypes.element,
  isMe:PropTypes.bool,
  makeFriend:PropTypes.func
};

ItemTopRacer.defaultProps = {
  icon: (
    <Avatar
      medium
      rounded
      overlayContainerStyle={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 0,
        borderColor: 'white'
      }}
      source={images.user}
      containerStyle={{ alignSelf: 'center' }}
    />
  ),
  isMe:false,
  makeFriend:null
};

export default connect(
  state => ({}),
  { makeFriend }
)(ItemTopRacer);
