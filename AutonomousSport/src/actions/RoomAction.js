import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import Util from '@/utils/Util';
import _ from 'lodash';
import Map from '@/models/Map';
import Room from '@/models/Room';

const TAG = 'RoomAction';
export const ACTIONS = {
  GET_ALL_MAP: 'GET_ALL_MAP',
  GET_ALL_ROOM: 'GET_ALL_ROOM'
};

export const fetchMap = ({ offset = 0, limit = 12 }) => async dispatch => {
  try {
    let response = await ApiService.getMapList({
      offset: offset,
      limit: limit
    });
    console.log(TAG, ' - fetchMap - response ', response);
    if (!_.isEmpty(response)) {
      response['list'] = response.list.map(item => {
        return new Map(item);
      });
    }
    dispatch({ type: ACTIONS.GET_ALL_MAP, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - fetchMap - error ', e);
  }

  dispatch({ type: ACTIONS.GET_ALL_MAP, payload: {} });
};

export const fetchRoom = ({ offset = 0, limit = 12 }) => async dispatch => {
  try {
    let response = await ApiService.getRoomList({
      offset: offset,
      limit: limit
    });
    console.log(TAG, ' - fetchRoom - response ', response);
    if (!_.isEmpty(response)) {
      response['list'] = response.list.map(item => {
        return new Room(item);
      });
    }
    dispatch({ type: ACTIONS.GET_ALL_ROOM, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - fetchRoom - error ', e);
  }

  dispatch({ type: ACTIONS.GET_ALL_ROOM, payload: {} });
};

// export const makeFriend = ({ friendId }) => async dispatch => {
//   try {
//     let response =
//       (await ApiService.makeFriend({
//         friendId
//       })) || {};
//     response['id'] = friendId;
//     console.log(TAG, ' - makeFriend - response ', response);
//     dispatch({ type: ACTIONS.MAKE_FRIEND, payload: response });
//     return;
//   } catch (e) {
//     console.log(TAG, ' - makeFriend - error ', e);
//   }

//   dispatch({ type: ACTIONS.MAKE_FRIEND, payload: {} });
// };
