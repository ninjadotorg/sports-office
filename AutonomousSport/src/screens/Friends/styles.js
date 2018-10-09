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
  topBar: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  containerTop: {
    padding: moderateScale(10),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  containerBottom: {
    flexDirection: 'row',
    paddingBottom: verticalScale(20),
    justifyContent: 'space-around'
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column'
  },
  list: {
    padding: moderateScale(10),
    flex: 1,
    backgroundColor: 'transparent'
  },
  textStyleButton: {
    color: '#02BB4F'
  },
  selectedTextStyleButton: {
    color: '#F6F6F6'
  },
  buttonGroup: {
    borderRadius: 7,
    backgroundColor: 'transparent'
  },
  selectedButtonStyle: {
    backgroundColor: '#02BB4F'
  },
  button: {
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#02BB4F',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  }
});

export default styles;
