import { ACTIONS } from '@/actions/FriendAction';
import _ from 'lodash';

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
        let friendList = _.cloneDeep(state.friendList);
        let list = friendList?.list || [];
        if (id && !_.isEmpty(list)) {
          const index = list.findIndex(item => item.id === id);
          if (index >= 0) {
            list[index]['is_maked_friend'] = true;
          }
          // console.log(
          //   TAG,
          //   ' FriendReducer-MAKE_FRIEND list index = ',
          //   list[index]
          // );
          // friendList['list'] = list;

          return { ...state, friendList: friendList };
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
