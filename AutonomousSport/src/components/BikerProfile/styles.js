import { StyleSheet } from 'react-native';
import { screenSize } from '@/utils/TextStyle';

const widthVideo = screenSize.width / 4;
const styles = StyleSheet.create({
  container: {
    width: widthVideo,
    flex: 1,
    flexDirection: 'column'
  },
  publisher: {
    height: widthVideo,
    width: widthVideo
  },
  publisherInfo: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    alignItems: 'flex-end',
    paddingVertical: 10,
    backgroundColor: 'rgba(2,187,79,0.5)'
  },
  subcriber: { height: widthVideo }
});
export default styles;
