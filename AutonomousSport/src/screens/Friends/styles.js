import { StyleSheet, Platform } from 'react-native';
import { screenSize, scale } from '@/utils/TextStyle';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818'
  },
  containerImg: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  topBar: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  containerTop: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: verticalScale(40),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  containerBottom: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center'
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column'
  },
  list: {
    flex: 1,
    paddingVertical: moderateScale(10),
    marginHorizontal: verticalScale(40),
    backgroundColor: 'transparent'
  },
  textStyleButton: {
    color: '#02BB4F'
  },
  selectedTextStyleButton: {
    color: '#F6F6F6'
  },
  buttonGroup: {
    borderColor: '#02BB4F',
    borderRadius: 32,
    backgroundColor: 'transparent'
  },
  selectedButtonStyle: {
    backgroundColor: '#02BB4F',
    borderColor: '#02BB4F'
  },
  button2: {
    borderRadius: 32,
    borderWidth: 1,
    backgroundColor: '#02BB4F',
    borderColor: '#02BB4F',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  },
  buttondis2: {
    borderRadius: 32,
    borderWidth: 1,
    backgroundColor: '#02BB4F',
    borderColor: '#02BB4F',
    opacity: 0.5,
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  },

  button: {
    borderRadius: 32,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#02BB4F',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  },
  image: {
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? 8 : 0,
    alignItems: 'center',
    justifyContent: 'center'
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius
  }
});

export default styles;
