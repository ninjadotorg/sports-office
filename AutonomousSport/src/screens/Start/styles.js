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
    backgroundColor: 'transparent'
  },
  containerTop: {
    padding: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerTopRight: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    paddingVertical: moderateScale(5),

    flexDirection: 'row'
  },
  topRightItem: {
    paddingHorizontal: moderateScale(10)
  },
  containerBottom: {
    flexDirection: 'row',
    paddingBottom: verticalScale(20),
    justifyContent: 'space-around'
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#02BB4F',
    width: scaleSize(100)
  }
});

export default styles;
