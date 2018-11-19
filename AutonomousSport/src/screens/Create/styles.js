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
  containerimg: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  topBar: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  containerTop: {
    padding: moderateScale(10),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  slider: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
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
  },
  textStyleButton: {
    color: 'white',
    fontWeight: 'bold'
  },
  selectedTextStyleButton: {
    color: 'white',
    fontWeight: 'bold'
  },
  buttonGroup: {
    // borderBottomColor: 'transparent',
    // borderTopColor: 'transparent',
    borderColor: 'transparent',
    shadowColor: 'transparent',
    backgroundColor: 'transparent',
    borderWidth: 0,
    flex: 1,
    maxWidth: screenSize.width / 2 + screenSize.width / 8
  },
  buttonItemStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  selectedButtonStyle: {
    // backgroundColor: mainColor.backgroundColor,
    borderBottomWidth: 2,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    borderBottomColor: '#ffc500'
  },
  containerBottom: {
    flexDirection: 'row',
    paddingBottom: verticalScale(30),
    justifyContent: 'space-around',
    width: '60%',
    alignItems: 'center',
    marginLeft: '20%'
  },
  button: {
    borderRadius: scaleSize(30),
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ffc500',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  }
});

export default styles;
