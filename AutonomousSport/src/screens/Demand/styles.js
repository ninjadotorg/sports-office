import { StyleSheet, Platform } from 'react-native';
import { screenSize } from '@/utils/TextStyle';
import {
  moderateScale,
  scale as scaleSize,
  verticalScale
} from 'react-native-size-matters';
import { colors, icons } from '@/assets';

export const color = {
  placeHolder: 'rgba(255,255,255,0.5)'
};
export const iconPlay = onPress =>
  icons.play({
    containerStyle: { position: 'absolute', alignSelf: 'center' },
    onPress: onPress
  });

const mainColor = {
  backgroundColor: '#181818'
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    flex: 1
  },
  containerVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  containerItem: {
    backgroundColor: colors.main_white,
    flex: 1,
    height: 220,
    justifyContent: 'center',
    marginVertical: 5
  },
  containerBottom: {
    position: 'absolute',
    bottom: 10,
    left: 10
  },
  containerTop: {
    padding: moderateScale(10),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textLabel: { color: color.placeHolder, flex: 1, textAlignVertical: 'center' }
});

export default styles;
