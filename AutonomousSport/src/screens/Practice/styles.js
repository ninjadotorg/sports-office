import { StyleSheet, Platform } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';
import { screenSize } from '@/utils/TextStyle';
import { colors } from '@/assets';

export const sizeCircle = screenSize.width / 1.5;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  containerTop: {
    padding: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerBottom: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingBottom: 30
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
  itemTop: {},
  textBottomItemTop: {
    color: colors.text_main_black,
    opacity: 0.4,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  textBottomItemBottom: {
    color: colors.text_main_black,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '500'
  }
});

export default styles;
