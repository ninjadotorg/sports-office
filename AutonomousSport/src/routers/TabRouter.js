/**
 * @providesModule TabRouter
 */

import { TabNavigator } from 'react-navigation';
import * as Screens from '@/screens';

const tabbarConfiguration = {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    upperCaseLabel: false,
    showIcon: true,
    showLabel: false,
    activeTintColor: 'white',
    style: {
      backgroundColor: '#111111'
    },
    tabStyle: {}
  }
};
const TabRouter = TabNavigator();

//   Home_Screen: {
//     screen: Screens.HomeScreen,
//     navigationOptions: {
//       tabBarLabel: 'Home',
//       tabBarIcon: ({ tintColor }) => (
//         <View></View>
//       )
//     }
//   },

//   ProductDemo_Screen: {
//     screen: Screens.ProductDemoScreen,
//     navigationOptions: {
//       tabBarLabel: 'Product Demo',
//       tabBarIcon: ({ tintColor }) => (
//         <View></View>
//       )
//     }
//   },

//   YourOrder_Screen: {
//     screen: Screens.TrackOrderScreen,
//     navigationOptions: {
//       tabBarLabel: 'Your Order',
//       tabBarIcon: ({ tintColor }) => (
//         <View></View>
//       )
//     }
//   },

//   Setting_Screen: {
//     screen: Screens.SettingScreen,
//     navigationOptions: {
//       tabBarLabel: 'Setting',
//       tabBarIcon: ({ tintColor }) => (
//         <View></View>
//       )
//     }
//   }
// },
// tabbarConfiguration
export default TabRouter;
