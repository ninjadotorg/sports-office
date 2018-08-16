import { combineReducers } from 'redux';
import * as NavigationReducer from './NavigationReducer';
import UserReducer from '@/reducers/UserReducer';
import FriendReducer from '@/reducers/FriendReducer';

export default combineReducers({
  navigation: NavigationReducer.StackReducer,
  user: UserReducer,
  friend: FriendReducer
});
