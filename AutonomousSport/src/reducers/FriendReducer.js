import { ACTIONS } from '@/actions/FriendAction';
import _ from 'lodash';
import LocalDatabase from '@/utils/LocalDatabase';
import ApiService from '@/services/ApiService';

const TAG = 'FriendReducer';
const initialState = { friendList: {} };
const FriendReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_ALL_FRIEND:
    case ACTIONS.GET_ALL_USER: {
      const payload = action.payload || {};
      console.log(TAG, ' FriendReducer-GET_ALL_USER payload = ', payload);
      return { ...state, friendList: payload };
    }
    case ACTIONS.MAKE_FRIEND: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload) && String(payload?.success) === '1') {
        console.log(
          TAG,
          ' FriendReducer-MAKE_FRIEND success payload = ',
          payload
        );
        const { id } = payload;
        let list = state.friendList?.list || [];
        if (id && !_.isEmpty(list)) {
          const index = list.findIndex(item => item.id === id);
          if (index >= 0) {
            list[index].is_maked_friend = true;
          }
          state.friendList['list'] = list;
          return { ...state };
        }
      }
      console.log(TAG, ' FriendReducer-MAKE_FRIEND payload = ', payload);
      return state;
    }

    default:
      return state;
  }
};

export default FriendReducer;
