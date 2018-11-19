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
  container: {
    flex: 1,
    flexDirection: 'row'
  },

  text: {
    color: 'white'
  },
  textLogo: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: verticalScale(20)
  },
  textLabel: { color: color.placeHolder, flex: 1, textAlignVertical: 'center' },
  endScreenText: {
    // marginBottom: verticalScale(20)
  },
  textButton,
  socialButtonText,
  buttonStyle,
  socialContainer: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  socialButtonIcon: { marginRight: 10, marginLeft: 0 },

  socialButtonTextFB: {
    ...socialButtonText,
    color: color.textSocial.facebook
  },
  socialButtonTextGG: {
    ...socialButtonText,
    color: color.textSocial.google
  },
  socialButtonFB: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 5,
    backgroundColor: color.social.facebook
  },
  socialButtonGG: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'row',
    backgroundColor: color.social.google
  },
  socialBottomTextContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  socialBottomText: { color: color.placeHolder },
  marginBottom10: { marginBottom: 10 },
  linkContainer: {
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  link: {
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10)
  },
  containerInput: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: verticalScale(10),
    borderBottomColor: 'rgba(255,255,255,0.2)'
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: scaleSize(120)
  },
  mainView: { flex: 1, alignContent: 'center', backgroundColor: 'transparent' },
  containerStyle: {
    flex: 1,
    paddingVertical: moderateScale(10),
    backgroundColor: 'transparent',
    // backgroundColor: '#232339',
    justifyContent: 'center'
  },
  imgContainerStyle: {
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  inputContainerStyle: {
    flex: 1,
    justifyContent: 'center'
  },
  errorItem: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});

export default styles;
