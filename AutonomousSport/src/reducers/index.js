import { combineReducers } from 'redux';
import * as NavigationReducer from './NavigationReducer';
import UserReducer from '@/reducers/UserReducer';
import FriendReducer from '@/reducers/FriendReducer';
import RoomReducer from '@/reducers/RoomReducer';
import RaceReducer from '@/reducers/RaceReducer';

export default combineReducers({
  navigation: NavigationReducer.StackReducer,
  user: UserReducer,
  friend: FriendReducer,
  room: RoomReducer,
  race: RaceReducer
});
