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

const widthInput = screenSize.width / 3;

export const sliderWidth = screenSize?.width || 100;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export const color = {
  placeHolder: 'rgba(255,255,255,0.5)'
};

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
  containerCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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
    color: '#02BB4F'
  },
  selectedTextStyleButton: {
    color: '#F6F6F6'
  },
  buttonGroup: {
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    shadowColor: 'transparent',
    backgroundColor: '#181818',
    flex: 1,
    borderWidth: 0
  },
  selectedButtonStyle: {
    backgroundColor: mainColor.backgroundColor,
    shadowColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  containerBottom: {
    flexDirection: 'row',
    paddingBottom: verticalScale(20),
    justifyContent: 'space-around'
  },
  button: {
    alignSelf: 'center',
    width: scaleSize(100),
    paddingHorizontal: scaleSize(20),
    backgroundColor: '#02BB4F',
    borderWidth: 1,
    borderRadius: scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent'
  },
  containerInput: {
    alignSelf: 'center',
    width: widthInput,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: verticalScale(10),
    borderBottomColor: 'rgba(255,255,255,0.2)'
  },
  textLabel: { color: color.placeHolder, flex: 1, textAlignVertical: 'center' }
});

export default styles;
