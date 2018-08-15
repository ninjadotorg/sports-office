import { createStackNavigator } from 'react-navigation';

import * as Screens from '@/screens';
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

// export const SignInStack = StackNavigator({
//   SignInScreen: {
//     screen: Screens.SignInScreen,
//     navigationOptions: customNavigationOption
//   },
//   ForgotPasswordScreen: {
//     screen: Screens.ForgotPasswordScreen,
//     navigationOptions: detailNavigationOption
//   }
// });

const StackRouter = createStackNavigator(
  {
    HomeScreen: {
      screen: Screens.HomeScreen,
      navigationOptions: customNavigationOption
    },
    ChallengeScreen: {
      screen: Screens.ChallengeScreen,
      navigationOptions: {
        header: null
      }
    },
    CreateRoomScreen: {
      screen: Screens.CreateRoomScreen,
      navigationOptions: customNavigationOption
    },
    SetupScreen: {
      screen: Screens.SetupScreen,
      navigationOptions: {
        header: null
      }
    },
    SignInScreen: {
      screen: Screens.SignInScreen,
      navigationOptions: {
        header: null
      }
    },
    StartScreen: {
      screen: Screens.StartScreen,
      navigationOptions: {
        header: null
      }
    },
    FriendsScreen: {
      screen: Screens.FriendsScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    headerMode: 'screen',
    initialRouteName: 'FriendsScreen'
  }
);

export default StackRouter;
