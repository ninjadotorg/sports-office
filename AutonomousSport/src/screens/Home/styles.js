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
    paddingBottom: verticalScale(60),
    justifyContent: 'space-around',
    width: '60%',
    alignSelf: 'center',
    alignItems: 'center'
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderRadius: scaleSize(30),
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#ffc500',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  },
  containerRowTop: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  itemTop: {
    width: '50%' // is 50% of container width
  }
});

export default styles;
