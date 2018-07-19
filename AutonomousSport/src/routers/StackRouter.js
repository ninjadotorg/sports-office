import { StackNavigator } from 'react-navigation';

import Screens from '@/screens';
import { FONT_FAMILY, fontSizeHeader } from '@/utils/TextStyle';
import { COLOR } from '@/utils/Constants';

const customNavigationOption = {
  headerBackTitleStyle: { color: COLOR.BLACK },
  headerBackTitle: null,
  headerStyle: {
    shadowColor: '#BEBEBE',
    shadowRadius: 0,
    shadowOpacity: 0, // remove shadow on iOS
    shadowOffset: {
      width: 0,
      height: 2
    },
    backgroundColor: COLOR.HEADER,
    elevation: 0, // remove shadow on Android
    borderBottomWidth: 0.5,
    borderColor: '#EBEBEB'
  },
  headerTitleStyle: {
    fontSize: fontSizeHeader(),
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
    fontFamily: FONT_FAMILY
  }
};

const detailNavigationOption = {
  headerBackTitleStyle: { color: COLOR.BLACK },
  headerBackTitle: null,
  headerStyle: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    fontSize: fontSizeHeader(),
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
    fontFamily: FONT_FAMILY
  }
};

export const SignInStack = StackNavigator({
  SignInScreen: {
    screen: Screens.SignInScreen,
    navigationOptions: customNavigationOption
  },
  ForgotPasswordScreen: {
    screen: Screens.ForgotPasswordScreen,
    navigationOptions: detailNavigationOption
  }
});

const StackRouter = StackNavigator({
  HomeScreen: {
    screen: Screens.HomeScreen,
    navigationOptions: customNavigationOption
  },
  SignInStack: {
    screen: SignInStack,
    navigationOptions: { header: null }
  }
});

export default StackRouter;
