import { ACTIONS } from '@/actions/RoomAction';
import _ from 'lodash';
import LocalDatabase from '@/utils/LocalDatabase';

const TAG = 'RoomReducer';
const initialState = { mapList: [], roomList: [], leftRoom: {}, joinRoom: {} };
const RoomReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_ALL_MAP: {
      const payload = action.payload || {};
      console.log(TAG, ' RoomReducer-GET_ALL_MAP payload = ', payload);
      // if(!_.isEmpty(payload)){

      // }
      return { ...state, mapList: payload };
    }
    case ACTIONS.GET_ALL_ROOM: {
      const payload = action.payload || {};
      console.log(TAG, ' RoomReducer-GET_ALL_ROOM payload = ', payload);
      return { ...state, roomList: payload };
    }
    case ACTIONS.LEFT_ROOM: {
      const payload = action.payload || {};
      return { ...state, leftRoom: payload };
    }
    case ACTIONS.JOIN_ROOM: {
      const payload = action.payload || {};
      return { ...state, joinRoom: payload };
    }
    // case ACTIONS.MAKE_FRIEND: {
    //   const payload = action.payload || {};
    //   if (!_.isEmpty(payload) && String(payload?.success) === '1') {
    //     console.log(
    //       TAG,
    //       ' FriendReducer-MAKE_FRIEND success payload = ',
    //       payload
    //     );
    //     const { id } = payload;
    //     let list = state.friendList?.list || [];
    //     if (id && !_.isEmpty(list)) {
    //       const index = list.findIndex(item => item.id === id);
    //       if (index >= 0) {
    //         list[index].is_maked_friend = true;
    //       }
    //       state.friendList['list'] = list;
    //       return { ...state };
    //     }
    //   }
    //   console.log(TAG, ' FriendReducer-MAKE_FRIEND payload = ', payload);
    //   return state;
    // }

    default:
      return state;
  }
};

export default RoomReducer;
