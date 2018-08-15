import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(5),
    flexDirection: 'row'
  }
});
export default styles;
