import { StyleSheet } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0,
    paddingVertical: moderateScale(5),
    flexDirection: 'row'
  },
  item: {
    paddingHorizontal: moderateScale(10)
  }
});
export default styles;
