import { StyleSheet, Image } from 'react-native';
import {
  verticalScale,
  scale as scaleSize,
  moderateScale
} from 'react-native-size-matters';
import images from '@/assets';

const sizeImagePlayerIcon = Image.resolveAssetSource(images.ic_racer1);
const heightPlayerIcon = scaleSize(28);
export const sizeIconRacing = {
  height: heightPlayerIcon,
  width:
    (sizeImagePlayerIcon.width * heightPlayerIcon) / sizeImagePlayerIcon.height
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffc500',
    borderColor: '#ffc500',
    borderRadius: scaleSize(25),
    borderWidth: 0,
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20),
    width: scaleSize(150)
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    position: 'relative'
  },
  map: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white'
  }
});

export default styles;
