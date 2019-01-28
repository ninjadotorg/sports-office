import React from 'react';
import { Icon } from 'react-native-elements';

export const colors = {
  main_white: '#fcfcfc',
  main_black: '#262628',
  main_red: '#f92e5b',
  text_main_black: '#262628',
  text_main_black_disable: '#cbcbcb',
  icon_main_black: '#262628',
  icon_main_active_red: '#f92e5b'
};
export const videos = {
  boxing: require('@/assets/videos/boxing.mp4'),
  yoga: require('@/assets/videos/yoga.mp4')
};
const images = {
  backgroundx: require('@/assets/images/bg.png'),
  background_detail_bottom: require('@/assets/images/background_detail_bottom.png'),
  background_top_race: require('@/assets/images/background_top_race.png'),
  logo: require('@/assets/images/logo.png'),
  ic_gold: require('@/assets/images/ic_gold.png'),
  ic_gold_top: require('@/assets/images/ic_gold_top.png'),
  ic_bronze: require('@/assets/images/ic_bronze.png'),
  ic_sliver: require('@/assets/images/ic_sliver.png'),
  back_score: require('@/assets/images/back_score.png'),
  bike: require('@/assets/images/bgxedap.png'),
  user: require('@/assets/images/ic_user.png'),
  user_friend: require('@/assets/images/ic_user_friend.png'),
  image_start: require('@/assets/images/image_start.png'),
  image_velocity: require('@/assets/images/image_velocity.png'),
  ic_plus_down: require('@/assets/images/ic_plus_down.png'),
  ic_like: require('@/assets/images/ic_like.png'),
  ic_battery: require('@/assets/images/ic_battery.png'),
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
  home: ({
    containerStyle = {},
    color = colors.icon_main_black,
    size = 25,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{}, containerStyle]}
      color={color}
      size={size}
      onPress={onPress}
      name="home"
      type="feather"
    />
  ),
  demand: ({
    containerStyle = {},
    color = colors.icon_main_black,
    size = 25,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{}, containerStyle]}
      color={color}
      size={size}
      onPress={onPress}
      name="play"
      type="feather"
    />
  ),
  setting: ({
    containerStyle = {},
    color = colors.icon_main_black,
    size = 25,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{}, containerStyle]}
      color={color}
      size={size}
      onPress={onPress}
      name="settings-outline"
      type="material-community"
    />
  ),
  earth: ({
    containerStyle = {},
    color = colors.icon_main_black,
    size = 25,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{}, containerStyle]}
      color={color}
      size={size}
      onPress={onPress}
      name="earth"
      type="material-community"
    />
  ),
  dot: ({
    containerStyle = {},
    color = colors.icon_main_black,
    size = 15,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{}, containerStyle]}
      color={color}
      size={size}
      name="dot-single"
      type="entypo"
    />
  ),
  dots: ({
    containerStyle = {},
    color = '#ffffff',
    size = 30,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[{}, containerStyle]}
      color={color}
      size={size}
      name="dots-three-horizontal"
      type="entypo"
    />
  ),
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
  play: ({
    containerStyle,
    color = '#ffffff',
    size = 12,
    onPress = null,
    iconStyle = {}
  }) => (
    <Icon
      containerStyle={[
        { width: 60, height: 60, borderRadius: 30 },
        containerStyle
      ]}
      color={color}
      size={size}
      reverse
      onPress={onPress}
      reverseColor="black"
      name="play"
      iconStyle={iconStyle}
      type="font-awesome"
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
