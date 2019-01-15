import { StyleSheet, Platform } from 'react-native';
import { screenSize } from '@/utils/TextStyle';
import {
  moderateScale,
  scale as scaleSize,
  verticalScale
} from 'react-native-size-matters';
import { colors } from '@/assets';

const entryBorderRadius = 8;
const wp = percentage => {
  const value = (percentage * screenSize.width) / 100;
  return Math.round(value);
};
const slideHeight = screenSize?.height * 0.36;
const slideWidth = wp(50);
const itemHorizontalMargin = wp(2);

export const sliderWidth = screenSize?.width || 100;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const mainColor = {
  backgroundColor: '#181818'
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  containerTop: {
    backgroundColor: colors.main_red,
    flex: 0.75,
    alignItems: 'center'
  },
  list: {
    flex: 1,
    paddingVertical: scaleSize(20),
    // paddingHorizontal: verticalScale(40),
    backgroundColor: 'white'
  },
  textStyleButton: {
    color: '#ffffff'
  }
});

export default styles;
