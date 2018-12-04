import { StyleSheet, Platform } from 'react-native';
import { screenSize } from '@/utils/TextStyle';
import {
  moderateScale,
  scale as scaleSize,
  verticalScale
} from 'react-native-size-matters';

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
  topBar: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  containerTop: {
    padding: moderateScale(10),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    color: 'black',
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  list: {
    flex: 1,
    paddingVertical: moderateScale(10),
    marginHorizontal: verticalScale(40),
    backgroundColor: 'transparent'
  },
  button: {
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ffc500',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  }
});

export default styles;
