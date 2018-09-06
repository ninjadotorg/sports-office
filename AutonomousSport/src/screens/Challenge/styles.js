import { StyleSheet } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  map: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'grey'
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
