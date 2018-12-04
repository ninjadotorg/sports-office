import React from 'react';
import { Icon } from 'react-native-elements';

const images = {
  backgroundx: require('@/assets/images/bg.png'),
  // map_list: [require('@/assets/images/map_01.png')],
  logo: require('@/assets/images/logo.png'),
  ic_gold: require('@/assets/images/ic_gold.png'),
  // ic_bronze: require('@/assets/images/ic_bronze.png'),
  ic_sliver: require('@/assets/images/ic_sliver.png'),
  back_score: require('@/assets/images/back_score.png'),
  bike: require('@/assets/images/bgxedap.png'),
  user: require('@/assets/images/ic_user.png'),
  user_friend: require('@/assets/images/ic_user_friend.png'),
  image_start: require('@/assets/images/image_start.png'),
  image_velocity: require('@/assets/images/image_velocity.png'),
  ic_plus_down: require('@/assets/images/ic_plus_down.png'),
  ic_plus_up: require('@/assets/images/ic_plus_up.png'),
  ic_bluetooth: require('@/assets/images/bluetooth.png'),
  ic_leader_board: require('@/assets/images/ic_leaderboard.png'),
  ic_status_bluetooth_on: require('@/assets/images/ic_status_bluetooth_on.png'),
  ic_status_bluetooth_off: require('@/assets/images/ic_status_bluetooth_off.png'),
  ic_eye_flash: require('@/assets/images/eye_slash.png'),
  ic_eye: require('@/assets/images/eye.png'),
  // mapVector: require('@/assets/images/map.svg'),
  // map: require('@/assets/images/map.jpg'),
  ic_racer1: require('@/assets/images/ic_racer1.png'),
  ic_no_friend_list: require('@/assets/images/nofriends.png'),
  ic_backtop: require('@/assets/images/ic_back.png'),
  ic_check: require('@/assets/images/check.png'),
  ic_norooms: require('@/assets/images/norooms.png')
};
export const icons = {
  close: ({
    containerStyle,
    color = 'rgba(192, 192, 192,0.5)',
    size = 25,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{ width: 30, height: 30 }, containerStyle]}
      color={color}
      size={size}
      reverse
      onPress={onPress}
      reverseColor="white"
      name="close"
      iconStyle={iconStyle}
      type="evilicon"
    />
  ),
  markerPlayer: ({
    containerStyle,
    color = 'rgba(192, 192, 192,0.5)',
    size = 25,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[
        {
          elevation: 1,
          textShadowColor: 'red',
          shadowOpacity: 1,
          shadowRadius: 10,
          textShadowOffset: { width: 10, height: 5 }
        },
        containerStyle
      ]}
      color={color}
      size={size}
      onPress={onPress}
      name="controller-record"
      iconStyle={iconStyle}
      type="entypo"
    />
  ),
  bluetooth: ({
    containerStyle = {},
    color = '#3E3E3D',
    size = 25,
    onPress = null
  }) => (
    <Icon
      containerStyle={containerStyle}
      color={color}
      size={size}
      onPress={onPress}
      name="md-bluetooth"
      type="ionicon"
    />
  ),
  bike: ({
    containerStyle = {},
    color = '#ADAFB2',
    size = 18,
    onPress = null
  }) => (
    <Icon
      containerStyle={containerStyle}
      color={color}
      size={size}
      onPress={onPress}
      name="bike"
      type="material-community"
    />
  ),
  groupUser: ({
    containerStyle = {},
    color = '#ADAFB2',
    size = 18,
    onPress = null
  }) => (
    <Icon
      containerStyle={containerStyle}
      color={color}
      size={size}
      onPress={onPress}
      name="users"
      type="feather"
    />
  ),
  back: ({
    containerStyle = {},
    color = '#FFFFFF',
    size = 25,
    onPress = null
  }) => (
    <Icon
      containerStyle={containerStyle}
      color={color}
      size={size}
      onPress={onPress}
      name="ios-arrow-dropleft"
      type="ionicon"
    />
  ),
  fail: ({
    containerStyle = {},
    color = '#FFFFFF',
    size = 25,
    onPress = null
  }) => (
    <Icon
      containerStyle={containerStyle}
      color={color}
      size={size}
      onPress={onPress}
      name="md-map"
      type="ionicon"
    />
  )
};
export default images;
