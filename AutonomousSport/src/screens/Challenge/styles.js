import { StyleSheet } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';

export const sizeIconRacing = {
  width: scaleSize(28),
  height: scaleSize(28)
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  map: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white'
  },
  button: {
    borderRadius: scaleSize(25),
    borderWidth: 0,
    backgroundColor: '#ffc500',
    borderColor: '#ffc500',
    minWidth: scaleSize(100),
    width: scaleSize(150),
    paddingHorizontal: scaleSize(20)
  }
});

export default styles;
