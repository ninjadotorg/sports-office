import { combineReducers } from 'redux';
import * as NavigationReducer from './NavigationReducer';

export default combineReducers({
  navigation: NavigationReducer.StackReducer
  //   home: HomeReducer
});
