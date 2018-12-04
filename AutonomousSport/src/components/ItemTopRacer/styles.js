import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: verticalScale(5),
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    
    borderBottomColor: '#76717f'
  }
});
export default styles;
