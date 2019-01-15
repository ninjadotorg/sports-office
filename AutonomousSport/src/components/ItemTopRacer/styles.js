import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { colors } from '@/assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: verticalScale(30),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: `${colors.main_black}10`
  }
});
export default styles;
