import { combineReducers } from 'redux';
import * as NavigationReducer from './NavigationReducer';
import UserReducer from '@/reducers/UserReducer';
import FriendReducer from '@/reducers/FriendReducer';
import RoomReducer from '@/reducers/RoomReducer';
import RaceReducer from '@/reducers/RaceReducer';
import P2PReducer from './P2PReducer';

export default combineReducers({
  navigation: NavigationReducer.StackReducer,
  user: UserReducer,
  friend: FriendReducer,
  room: RoomReducer,
  p2p: P2PReducer,
  race: RaceReducer
});
