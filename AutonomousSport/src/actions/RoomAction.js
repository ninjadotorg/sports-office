import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import Util from '@/utils/Util';
import _ from 'lodash';
import Map from '@/models/Map';
import Room from '@/models/Room';

const TAG = 'RoomAction';
export const ACTIONS = {
  GET_ALL_MAP: 'GET_ALL_MAP',
  GET_ALL_ROOM: 'GET_ALL_ROOM',
  LEFT_ROOM: 'LEFT_ROOM',
  FINISHED_ROOM: 'FINISHED_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  START_RACING: 'START_RACING'
};

export const fetchMap = ({ offset = 0, limit = 12 }) => async dispatch => {
  try {
    let response = await ApiService.getMapList({
      offset: offset,
      limit: limit
    });
    console.log(TAG, ' - fetchMap - response ', response);
    if (!_.isEmpty(response)) {
      response['list'] = response?.list?.map(item => {
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
      response['list'] = response?.list?.map(item => {
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

export const leftRoom = ({ session = '' }) => async dispatch => {
  try {
    if (session) {
      let response = await ApiService.leftRoom({
        session: session
      });
      console.log(TAG, ' - leftRoom - response ', response);
      dispatch({ type: ACTIONS.LEFT_ROOM, payload: response });

      return;
    }
  } catch (e) {
    console.log(TAG, ' - leftRoom - error ', e);
  }

  dispatch({ type: ACTIONS.LEFT_ROOM, payload: {} });
};

export const finishedRoom = ({ session = '' }) => async dispatch => {
  try {
    if (session) {
      let response = await ApiService.finishedRoom({
        session: session
      });
      console.log(TAG, ' - finishedRoom - response ', response);
      dispatch({ type: ACTIONS.FINISHED_ROOM, payload: response });

      return;
    }
  } catch (e) {
    console.log(TAG, ' - finishedRoom - error ', e);
  }

  dispatch({ type: ACTIONS.FINISHED_ROOM, payload: {} });
};

export const joinRoom = ({ session = '' }) => async dispatch => {
  try {
    if (session) {
      let response = await ApiService.joinRoom({
        session: session
      });
      console.log(TAG, ' - joinRoom - response ', response);
      dispatch({ type: ACTIONS.JOIN_ROOM, payload: response });

      return;
    }
  } catch (e) {
    console.log(TAG, ' - joinRoom - error ', e);
  }

  dispatch({ type: ACTIONS.JOIN_ROOM, payload: {} });
};
export const startRacing = ({ session }) => async dispatch => {
  try {
    let response: Room =
      (await ApiService.startRacing({
        session
      })) || undefined;

    dispatch({ type: ACTIONS.START_RACING, payload: response?.toJSON() || {} });
    return;
  } catch (e) {
    console.log(TAG, ' - startRacing - error ', e);
  }

  dispatch({ type: ACTIONS.START_RACING, payload: {} });
};
