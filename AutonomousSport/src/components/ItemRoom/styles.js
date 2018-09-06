import { StyleSheet, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { screenSize } from '@/utils/TextStyle';

const heightItem = (50 * screenSize.height) / 100;
const heightImage = (heightItem * 2) / 3;
// const widthImage = (heightImage * 12) / 12;

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
  container: {
    width: itemWidth,
    height: '100%',
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 10
  },
  containerItemsChecked: {
    borderColor: 'green',
    borderWidth: 1
  },
  containerItem: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
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
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius
  }
});
export default styles;
