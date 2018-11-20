import ApiService from '@/services/ApiService';
import LocalDatabase from '@/utils/LocalDatabase';
import Util from '@/utils/Util';
import _ from 'lodash';

const TAG = 'FriendAction';
export const ACTIONS = {
  GET_ALL_USER: 'GET_ALL_USER',
  SEARCH_ALL_USER: 'SEARCH_ALL_USER',
  GET_ALL_FRIEND: 'GET_ALL_FRIEND',
  SEARCH_ALL_FRIEND: 'SEARCH_ALL_FRIEND',
  MAKE_FRIEND: 'MAKE_FRIEND',
  MAKE_INVITE: 'MAKE_INVITE'
};

export const fetchAllUser = ({
  offset = 0,
  limit = 12,
  search = ''
}) => async dispatch => {
  try {
    const response = await ApiService.getAllUser({
      offset: offset,
      limit: limit,
      search: search
    });
    console.log(TAG, ' - fetchAllUser - response ', response);
    dispatch({
      type: _.isEmpty(search) ? ACTIONS.GET_ALL_USER : ACTIONS.SEARCH_ALL_USER,
      payload: response
    });
    return;
  } catch (e) {
    console.log(TAG, ' - fetchAllUser - error ', e);
  }

  dispatch({
    type: _.isEmpty(search) ? ACTIONS.GET_ALL_USER : ACTIONS.SEARCH_ALL_USER,
    payload: {}
  });
};

export const fetchAllFriend = ({
  offset = 0,
  limit = 12,
  search = ''
}) => async dispatch => {
  try {
    let response = await ApiService.getAllFriend({
      offset: offset,
      limit: limit,
      search: search
    });

    // if (!_.isEmpty(response)) {
    // const list = response.list.map(item => {
    //   item['is_maked_friend'] = true;
    //   return item;
    // });
    // response['list'] = list;
    // console.log(TAG, ' - fetchAllFriend - response ', response);
    // }
    dispatch({
      type: _.isEmpty(search)
        ? ACTIONS.GET_ALL_FRIEND
        : ACTIONS.SEARCH_ALL_FRIEND,
      payload: response
    });
    return;
  } catch (e) {
    console.log(TAG, ' - fetchAllFriend - error ', e);
  }

  dispatch({
    type: _.isEmpty(search)
      ? ACTIONS.GET_ALL_FRIEND
      : ACTIONS.SEARCH_ALL_FRIEND,
    payload: {}
  });
};

export const makeFriend = ({ friendId }) => async dispatch => {
  try {
    if (friendId > 0) {
      let response =
        (await ApiService.makeFriend({
          friendId
        })) || {};
      response['id'] = friendId;
      // console.log(TAG, ' - makeFriend - response ', response);
      dispatch({ type: ACTIONS.MAKE_FRIEND, payload: response });
      return;
    }
  } catch (e) {
    console.log(TAG, ' - makeFriend - error ', e);
  }

  dispatch({ type: ACTIONS.MAKE_FRIEND, payload: {} });
};

export const makeInvited = ({ friendId, invited }) => async dispatch => {
  try {
    if (friendId > 0) {
      var response = { invited: invited, id: friendId };
      dispatch({ type: ACTIONS.MAKE_INVITE, payload: response });
      return;
    }
  } catch (e) {
    console.log(TAG, ' - makInvite - error ', e);
  }

  dispatch({ type: ACTIONS.MAKE_INVITE, payload: {} });
};
