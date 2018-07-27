import { combineReducers } from 'redux';
import * as NavigationReducer from './NavigationReducer';
import UserReducer from '@/reducers/UserReducer';

export default combineReducers({
  navigation: NavigationReducer.StackReducer,
  user: UserReducer
});
