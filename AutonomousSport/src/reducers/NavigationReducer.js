import * as Routers from '@/routers';
import { NavigationActions } from 'react-navigation';
import Constants from '@/utils/Constants';
import { TAG as TAGHOME } from '@/screens/Home';

// const initTabState = Routers.TabRouter.router.getStateForAction(TAGHOME);
// export function TabReducer(state = initTabState, action) {
//   console.log(action);
//   console.log(JSON.stringify(state));
//   switch (action.type) {
//     default:
//       return Routers.TabRouter.router.getStateForAction(action, state) || state;
//   }
// }

const initStackState = Routers.StackRouter.router.getStateForAction('');
export function StackReducer(state = initStackState, action) {
  console.log(action);
  console.log(JSON.stringify(state));
  switch (action.type) {
    case Constants.BACK_KEY: {
      const navigationAction = NavigationActions.back({});
      return Routers.StackRouter.router.getStateForAction(
        navigationAction,
        state
      );
    }
    default:
      return (
        Routers.StackRouter.router.getStateForAction(action, state) || state
      );
  }
}
