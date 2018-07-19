/**
 * @providesModule DrawerRouter
 */

import { DrawerNavigator } from 'react-navigation';

import * as Screens from '@/screens';

const DrawerRouter = DrawerNavigator(
  {
    Home_Screen: {
      screen: Screens.CustomizeScreen,
      navigationOptions: {
        drawerLabel: 'SMART OFFICE'
      }
    }
  },
  {
    // contentComponent: Menu
  }
);
export default DrawerRouter;
