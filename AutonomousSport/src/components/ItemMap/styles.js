import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { screenSize } from '@/utils/TextStyle';

const heightItem = (50 * screenSize.height) / 100;
const heightImage = (heightItem * 2) / 3;
const widthImage = (heightImage * 12) / 12;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(10)
  },
  containerItemsChecked: {
    borderColor: 'green',
    borderWidth: 1
  },
  containerItem: {
    flexDirection: 'column',
    height: heightItem,
    borderColor: 'blue'
  },
  imageContainerIOS: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden', 
  },

  image: { width: widthImage, height: heightImage }
});
export default styles;
