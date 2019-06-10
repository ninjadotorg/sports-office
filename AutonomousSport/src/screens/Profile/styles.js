import { StyleSheet } from 'react-native';
import { scale } from '@/utils/TextStyle';
import {
  scale as scaleSize,
  moderateScale,
  verticalScale
} from 'react-native-size-matters';

const textButton = {
  textAlign: 'center',
  color: '#534c5f',
  fontWeight: 'bold',
  flex: 1
};

const socialButtonText = {
  ...textButton,
  marginTop: 5
};

const buttonStyle = {
  height: 50,
  backgroundColor: '#ffc500',
  borderWidth: 1,
  borderRadius: scaleSize(30),
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: 'transparent'
};

export const color = {
  placeHolder: 'rgba(255,255,255,0.5)',
  social: {
    facebook: '#3F51B5',
    google: '#DE4940'
    // facebook: 'transparent',
    // google: 'transparent'
  },
  textSocial: {
    facebook: 'black',
    google: 'black'
  }
};

//backgroundColor: '#232339'

const styles = StyleSheet.create({
  buttonStyle,

  container: {
    flex: 1,
    flexDirection: 'row'
  },
  containerInput: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: verticalScale(10)
  },
  containerStyle: {
    flex: 1,
    paddingVertical: moderateScale(10),
    backgroundColor: 'transparent',
    // backgroundColor: '#232339',
    justifyContent: 'center'
  },
  endScreenText: {
    // marginBottom: verticalScale(20)
  },
  errorItem: {
    color: 'red',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%'
  },
  imgContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40
  },
  inputContainerStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  link: {
    alignSelf: 'center',
    color: 'white',
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
    textAlign: 'center'
  },
  linkContainer: {
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  mainView: { alignContent: 'center', backgroundColor: 'transparent', flex: 1 },

  marginBottom10: { marginBottom: 10 },
  scrollView: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    paddingHorizontal: scaleSize(120)
  },
  socialBottomText: { color: color.placeHolder },
  socialBottomTextContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  socialButton: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  socialButtonFB: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 5,
    backgroundColor: color.social.facebook
  },
  socialButtonGG: {
    backgroundColor: color.social.google,
    flex: 1,
    flexDirection: 'row',
    marginLeft: 5
  },
  socialButtonIcon: { marginLeft: 0, marginRight: 10 },
  socialButtonText,
  socialButtonTextFB: {
    ...socialButtonText,
    color: color.textSocial.facebook
  },
  socialButtonTextGG: {
    ...socialButtonText,
    color: color.textSocial.google
  },
  socialContainer: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  text: {
    color: 'white'
  },
  textButton,

  textLabel: { color: color.placeHolder, flex: 1, textAlignVertical: 'center' },
  textLogo: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: verticalScale(20)
  }
});

export default styles;
