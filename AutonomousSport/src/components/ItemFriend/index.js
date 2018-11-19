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
import { makeFriend, makeInvited } from '@/actions/FriendAction';
import { onClickView } from '@/utils/ViewUtil';
import _ from 'lodash';
import images from '@/assets';

export const TAG = 'ItemFriend';

class ItemFriend extends PureComponent {
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
    const { dataItem, inviteMode = false } = this.props;

    console.log('invited onClickMakeFriend', dataItem);

    if (!inviteMode) {
      if (dataItem?.id && !dataItem['is_maked_friend']) {
        this.setState({
          isLoading: true
        });
        this.props.makeFriend({ friendId: dataItem?.id });
      }
    } else {
      this.props.selectIdfn(dataItem?.id);

      this.props.makeInvited({
        friendId: dataItem?.id,
        invited: dataItem?.is_add_invited
      });

      this.setState({
        dataItem: dataItem
      });
    }
  });

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(TAG, ' getDerivedStateFromProps begin = ', nextProps.dataItem);
  //   if (
  //     JSON.stringify(nextProps.dataItem) !== JSON.stringify(prevState.dataItem)
  //   ) {
  //     return {
  //       dataItem: nextProps.dataItem || {},
  //       isLoading: false
  //     };
  //   }
  //   return null;
  // }

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
    // console.log('invited', dataItem);
    const mile = Math.ceil(dataItem.Profile.miles || 0);
    return (
      <View style={[styles.container, {}]}>
        <Avatar
          medium
          rounded
          overlayContainerStyle={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 0,
            borderColor: 'white'
          }}
          source={images.user}
          onPress={() => console.log('Works!')}
          activeOpacity={0.2}
          containerStyle={{ alignSelf: 'center' }}
        />

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
            {`${Math.ceil(dataItem.Profile.kcal || 0)} Kcal`}
          </Text>
        </View>
        <Text
          style={[
            TextStyle.mediumText,
            {
              color: 'white',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              marginRight: verticalScale(24)
            }
          ]}
        >
          {`${mile} ${dataItem.textRouteUnit}${mile > 1 ? 's' : ''}`}
        </Text>

        {this.props.inviteMode ? (
          <Button
            containerViewStyle={{
              marginRight: 0,
              borderRadius: scale(30),
              borderWidth: 1,
              borderColor: dataItem?.is_add_invited ? '#76717f' : 'transparent',
              backgroundColor: dataItem?.is_add_invited
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
                color: dataItem?.is_add_invited ? 'white' : '#544e60'
              }
            ]}
            buttonStyle={{ backgroundColor: 'transparent' }}
            title={dataItem?.is_add_invited ? 'Invited' : 'Invite'}
            onPress={this.onClickMakeFriend}
            rightIcon={
              dataItem?.is_add_invited
                ? { name: 'ios-checkmark', type: 'ionicon' }
                : undefined
            }
          />
        ) : (
          <Button
            rounded
            containerViewStyle={{
              marginRight: 0,
              borderRadius: scale(30),
              borderWidth: 1,
              borderColor: dataItem?.is_maked_friend
                ? '#76717f'
                : 'transparent',
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
          />
        )}
      </View>
    );
  }
}

ItemFriend.propTypes = {
  dataItem: PropTypes.instanceOf(User).isRequired
};

ItemFriend.defaultProps = {};

export default connect(
  state => ({}),
  { makeFriend, makeInvited }
)(ItemFriend);
