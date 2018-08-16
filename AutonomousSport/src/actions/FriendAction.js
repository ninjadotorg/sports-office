import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import Util from '@/utils/Util';

const TAG = 'FriendAction';
export const ACTIONS = {
  GET_ALL_USER: 'GET_ALL_USER',
  GET_ALL_FRIEND: 'GET_ALL_FRIEND',
  MAKE_FRIEND: 'MAKE_FRIEND'
};

export const fetchAllUser = ({ offset = 0, limit = 12 }) => async dispatch => {
  try {
    const response = await ApiService.getAllUser({
      offset: offset,
      limit: limit
    });
    console.log(TAG, ' - fetchAllUser - response ', response);
    dispatch({ type: ACTIONS.GET_ALL_USER, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - fetchAllUser - error ', e);
  }

  dispatch({ type: ACTIONS.GET_ALL_USER, payload: {} });
};

export const fetchAllFriend = ({
  offset = 0,
  limit = 12
}) => async dispatch => {
  try {
    const response = await ApiService.getAllFriend({
      offset: offset,
      limit: limit
    });
    console.log(TAG, ' - fetchAllUser - response ', response);
    dispatch({ type: ACTIONS.GET_ALL_FRIEND, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - fetchAllUser - error ', e);
  }

  dispatch({ type: ACTIONS.GET_ALL_FRIEND, payload: {} });
};

export const makeFriend = ({ friendId }) => async dispatch => {
  try {
    let response =
      (await ApiService.makeFriend({
        friendId
      })) || {};
    response['id'] = friendId;
    console.log(TAG, ' - makeFriend - response ', response);
    dispatch({ type: ACTIONS.MAKE_FRIEND, payload: response });
    return;
  } catch (e) {
    console.log(TAG, ' - makeFriend - error ', e);
  }

  dispatch({ type: ACTIONS.MAKE_FRIEND, payload: {} });
};
