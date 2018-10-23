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
    backgroundColor: 'transparent'
  },
  topBar: {
    alignSelf: 'center',
    flexDirection: 'row', 
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
  },
  containerTop: {
    padding: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerTopRight: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    paddingVertical: moderateScale(5),
    flexDirection: 'row'
  },
  topRightItem: {
    paddingHorizontal: moderateScale(10)
  },
  containerBottom: {
    flexDirection: 'row',
    paddingBottom: verticalScale(60),
    justifyContent: 'space-around',
    width:'60%',
    alignItems: 'center',
    marginLeft:'20%',
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#02BB4F',
    minWidth: scaleSize(100),
    paddingHorizontal: scaleSize(20)
  },
  containerRowTop: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  itemTop:{
    width: '50%' // is 50% of container width
  }
});

export default styles;
