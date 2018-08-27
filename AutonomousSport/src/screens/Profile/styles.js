import { StyleSheet } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';
import { screenSize } from '@/utils/TextStyle';

const widthInput = screenSize.width / 3;

export const color = {
  placeHolder: 'rgba(255,255,255,0.5)'
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#181818'
  },
  textLabel: { color: color.placeHolder, flex: 1, textAlignVertical: 'center' },
  button: {
    borderRadius: 25,
    borderWidth: 0,
    backgroundColor: '#02BB4F',
    borderColor: '#02BB4F',
    minWidth: scaleSize(100),
    width: widthInput
  },
  containerInput: {
    alignSelf: 'center',
    width: widthInput,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: verticalScale(10),
    borderBottomColor: 'rgba(255,255,255,0.2)'
  }
});

export default styles;
