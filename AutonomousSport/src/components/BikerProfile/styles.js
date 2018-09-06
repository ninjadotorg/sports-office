import { StyleSheet } from 'react-native';
import { screenSize } from '@/utils/TextStyle';

const widthVideo = screenSize.width / 4;
const styles = StyleSheet.create({
  container: {
    width: widthVideo,
    flex: 1,
    flexDirection: 'column'
  },
  publisher: { height: widthVideo },
  subcriber: { height: widthVideo }
});
export default styles;
