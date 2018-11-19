import { createStackNavigator } from 'react-navigation';

import * as Screens from '@/screens';
import { FONT_FAMILY, fontSizeHeader } from '@/utils/TextStyle';
import { COLOR } from '@/utils/Constants';
import TransitionConfig from '@/utils/TransitionConfig';

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
      navigationOptions: {
        header: null
      }
    },
    ChallengeScreen: {
      screen: Screens.ChallengeScreen,
      navigationOptions: {
        header: null
      }
    },
    ChallengeMapScreen: {
      screen: Screens.ChallengeMapScreen,
      navigationOptions: {
        header: null
      }
    },
    ChallengeNameScreen: {
      screen: Screens.ChallengeNameScreen,
      navigationOptions: {
        header: null
      }
    },
    CreateRoomScreen: {
      screen: Screens.CreateRoomScreen,
      navigationOptions: {
        header: null
      }
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
    NewRoomScreen: {
      screen: Screens.NewRoomScreen,
      navigationOptions: {
        header: null
      }
    },
    FriendsScreen: {
      screen: Screens.FriendsScreen,
      navigationOptions: {
        header: null
      }
    },
    ProfileScreen: {
      screen: Screens.ProfileScreen,
      navigationOptions: {
        header: null
      }
    },
    ChooseRoundScreen: {
      screen: Screens.ChooseRoundScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    headerMode: 'screen',
    mode: 'card',
    // initialRouteName: 'CreateRoomScreen',
    // initialRouteParams: { transition: 'fade' },
    transitionConfig: TransitionConfig,
    lazy: true,
    initialRouteName: 'SignInScreen'
  }
);

export default StackRouter;
