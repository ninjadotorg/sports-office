import { StyleSheet, Platform } from 'react-native';
import { screenSize } from '@/utils/TextStyle';

const entryBorderRadius = 8;
const wp = percentage => {
  const value = (percentage * screenSize.width) / 100;
  return Math.round(value);
};
const slideHeight = screenSize?.height * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = screenSize?.width || 100;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  slider: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  button: {
    backgroundColor: 'green',
    marginBottom: 10
  },
  joinRoom: {
    width: 100,
    padding: 10
  },
  slideInnerContainer: {
    width: itemWidth,
    height: '100%',
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 10 // needed for shadow
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 0 : -1,
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,
    borderRadius: entryBorderRadius
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    backgroundColor: 'red',
    borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  title: {
    color: 'black',
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  goal: {
    color: 'black',
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5
  }
});

export default styles;
