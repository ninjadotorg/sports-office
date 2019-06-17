import { StyleSheet, Platform } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderColor: '#ffc500',
    borderRadius: 32,
    borderWidth: 1,
    minWidth: verticalScale(20),
    paddingHorizontal: verticalScale(20)
  },
  button2: {
    backgroundColor: '#ffc500',
    borderColor: '#ffc500',
    borderRadius: 32,
    borderWidth: 1,
    minWidth: verticalScale(20),
    paddingHorizontal: verticalScale(20)
  },

  buttonGroup: {
    backgroundColor: 'transparent',
    borderColor: '#ffc500',
    borderRadius: 32
  },
  buttondis2: {
    backgroundColor: '#ffc500',
    borderColor: '#ffc500',
    borderRadius: 32,
    borderWidth: 1,
    minWidth: verticalScale(80),
    opacity: 0.5,
    paddingHorizontal: verticalScale(20)
  },
  container: {
    backgroundColor: '#181818',
    flex: 1
  },
  containerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: verticalScale(20)
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column'
  },
  containerImg: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerTop: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: verticalScale(40),
    paddingVertical: moderateScale(10)
  },
  image: {
    alignItems: 'center',
    borderRadius: Platform.OS === 'ios' ? 8 : 0,
    justifyContent: 'center',
    resizeMode: 'cover'
  },
  list: {
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: verticalScale(40),
    paddingVertical: moderateScale(10)
  },
  selectedButtonStyle: {
    backgroundColor: '#ffc500',
    borderColor: '#ffc500'
  },
  selectedTextStyleButton: {
    color: '#534c5f'
  },

  textStyleButton: {
    color: '#ffc500'
  }
});

export default styles;
