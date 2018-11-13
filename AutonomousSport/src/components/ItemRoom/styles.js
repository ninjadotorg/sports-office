import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { screenSize } from '@/utils/TextStyle';

const heightItem = (60 * screenSize.height) / 100;
const heightImage = (heightItem * 2) / 3;
const widthImage = (heightImage * 12) / 12;

const wp = percentage => {
  const value = (percentage * screenSize.width) / 100;
  return Math.round(value);
};
const slideHeight = screenSize?.height * 0.36;

const entryBorderRadius = 8;
const slideWidth = wp(50);
const itemHorizontalMargin = wp(2);

export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = StyleSheet.create({
  // container: {
  //   width: itemWidth,
  //   height: '100%',
  //   paddingHorizontal: itemHorizontalMargin,
  //   paddingBottom: 10
  // },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(10),
    borderRadius: moderateScale(10),
    width: widthImage,
    height: heightItem
  },
  containerItemsChecked: {
    borderColor: 'green',
    borderWidth: 1
  },
  // containerItem: {
  //   flex: 1,
  //   backgroundColor: 'black',
  //   flexDirection: 'column',
  //   borderColor: 'blue'
  // },
  containerItem: {
    flexDirection: 'column',
    height: '100%',
    borderColor: 'blue'
  },

  slideInnerContainer: {},
  imageContainer: {
    height: '100%',
    marginBottom: Platform.OS === 'ios' ? 0 : -1,
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,
    borderRadius: entryBorderRadius
  },
  imageContainerIOS: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: widthImage,
    height: heightImage,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }
  // image: {
  //   ...StyleSheet.absoluteFillObject,
  //   resizeMode: 'cover',
  //   borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0
  // }
});
export default styles;
