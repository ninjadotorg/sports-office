import React from 'react';
import { Icon } from 'react-native-elements';

const images = {
  map_list: [require('@/assets/images/map_01.png')]
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
  )
};
export default images;
