import { StyleSheet, Platform, Dimensions } from 'react-native';

import { COLOR } from '@/utils/Constants';

export const screenWidth = Dimensions.get('window').width;
export const screenSize = Dimensions.get('window');
export const fontSizer = () => {
  return scale() * 12;
};
export const scale = () => {
  if (screenWidth > 350) {
    return 1.33;
  } else if (screenWidth > 250) {
    return 1.17;
  } else {
    return 1;
  }
};

export const fontSizeHeader = () => 15 * scale();

export const FONT_FAMILY = Platform.OS === 'ios' ? 'Poppins' : 'poppins';
const TextStyle = StyleSheet.create({
  extraText: {
    fontFamily: FONT_FAMILY,
    fontSize: 22 * scale()
  },
  bigText: {
    fontFamily: FONT_FAMILY,
    fontSize: 18 * scale()
  },

  mediumText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14 * scale()
  },
  normalText: {
    fontFamily: FONT_FAMILY,
    fontSize: 12 * scale()
  },
  smallText: {
    fontFamily: FONT_FAMILY,
    fontSize: 10 * scale()
  },
  minimizeText: {
    fontFamily: FONT_FAMILY,
    fontSize: 7 * scale()
  },
  button: {
    height: 42,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7
  },
  buttonText: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLOR.WHITE
  }
});
export default TextStyle;
