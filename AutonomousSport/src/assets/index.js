import React from 'react';
import { Icon } from 'react-native-elements';

const images = {
  map_list: [require('@/assets/images/map_01.png')],
  logo: require('@/assets/images/logo.png'),
  bike: require('@/assets/images/bike.png'),
  user: require('@/assets/images/ic_user.png'),
  image_start: require('@/assets/images/image_start.png'),
  image_velocity: require('@/assets/images/image_velocity.png'),
  ic_plus_down: require('@/assets/images/ic_plus_down.png'),
  ic_plus_up: require('@/assets/images/ic_plus_up.png')
};
export const icons = {
  close: ({
    containerStyle,
    color = 'rgba(192, 192, 192,0.5)',
    size = 25,
    onPress = null
  }) => (
    <Icon
      containerStyle={[{ width: 30, height: 30 }, containerStyle]}
      color={color}
      size={size}
      reverse
      onPress={onPress}
      reverseColor="white"
      name="close"
      type="evilicon"
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
