import { StyleSheet } from 'react-native';
import { scale as scaleSize } from 'react-native-size-matters';
import { colors } from '@/assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  styleDot: {
    backgroundColor: colors.icon_main_black
  },
  styleText: {
    color: colors.text_main_black,
    fontWeight: '500'
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});
export default styles;
