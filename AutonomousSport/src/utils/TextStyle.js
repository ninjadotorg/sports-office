import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native';
import {
  moderateScale,
  verticalScale,
  scale as horizontalScale
} from 'react-native-size-matters';
import { COLOR } from '@/utils/Constants';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 20;
export const screenWidth = Dimensions.get('window').width;
export const screenSize = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - STATUSBAR_HEIGHT
};

// export const screenSize = Dimensions.get('window');
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

export const FONT_FAMILY = Platform.OS === 'ios' ? 'Roboto' : 'Roboto';
const TextStyle = StyleSheet.create({
  xxxExtraText: {
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(60)
  },
  xxExtraText: {
    fontFamily: FONT_FAMILY,
    fontSize: 30 * scale()
  },
  xExtraText: {
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(26)
  },
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
