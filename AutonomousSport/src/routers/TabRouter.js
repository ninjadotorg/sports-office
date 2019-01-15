import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import * as Screens from '@/screens';
import images, { colors, icons } from '@/assets';
import HomeContainer, {
  TAG as TAG_HOME_CONTAINER
} from '@/containers/HomeContainer';
import TextStyle from '@/utils/TextStyle';

export const TAG = 'TabRouter';

const tabbarConfiguration = {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    upperCaseLabel: false,
    showIcon: true,
    showLabel: true,
    inactiveTintColor: colors.icon_main_black,
    activeTintColor: colors.icon_main_active_red,
    style: {
      borderTopWidth: 0,
      backgroundColor: colors.main_white,
      height: Platform.OS === 'ios' ? 48 : 60
    },
    labelStyle: TextStyle.normalText,
    tabStyle: {}
  }
};

const TabRouter = createBottomTabNavigator(
  {
    HomeScreen: {
      screen: HomeContainer,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, tintColor }) =>
          icons.home({
            color: focused ? colors.icon_main_active_red : tintColor
          })
      }
    },
    DemandScreen: {
      screen: Screens.HomeScreen,
      navigationOptions: {
        tabBarLabel: 'On demand',
        tabBarIcon: ({ focused, tintColor }) =>
          icons.demand({
            color: focused ? colors.icon_main_active_red : tintColor
          })
      }
    },
    FeedScreen: {
      screen: Screens.FeedScreen,
      navigationOptions: {
        tabBarLabel: 'Feed',
        tabBarIcon: ({ focused, tintColor }) =>
          icons.earth({
            color: focused ? colors.icon_main_active_red : tintColor
          })
      }
    },
    SettingsScreen: {
      screen: Screens.SettingsScreen,
      navigationOptions: {
        tabBarLabel: 'Setting',
        tabBarIcon: ({ focused, tintColor }) =>
          icons.setting({
            color: focused ? colors.icon_main_active_red : tintColor
          })
      }
    }
  },
  {
    ...tabbarConfiguration
  }
);
export default TabRouter;
