import { ACTIONS } from '@/actions/FriendAction';
import _ from 'lodash';

const TAG = 'FriendReducer';
const initialState = { friendList: {}, invitedlist: [] };
const FriendReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_ALL_FRIEND:
    case ACTIONS.GET_ALL_USER: {
      const payload = action.payload || {};
      // console.log(TAG, ' FriendReducer-GET_ALL_USER payload = ', payload);

      let list = _.cloneDeep(state.invitedlist);
      //let list = friendList? || [];
      console.log(TAG, ' FriendReducer-GET_ALL_USER list = ', list);

      if (!_.isEmpty(payload.list) && !_.isEmpty(list)) {
        payload.list.forEach(function(element, index, array) {
          const index2 = list.findIndex(item => item.id === element.id);
          //console.log(TAG, ' FriendReducer-GET_ALL_USER element = ', element);
          if (index2 >= 0) array[index]['is_add_invited'] = true;
        });

        // console.log(
        //   TAG,
        //   ' FriendReducer-GET_ALL_USER payload.list = ',
        //   payload.list
        // );
      }

      return { ...state, friendList: payload };
    }
    case ACTIONS.MAKE_FRIEND: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload) && String(payload?.success) === '1') {
        const { id } = payload;
        let friendList = _.cloneDeep(state.friendList) || {};

        let list = friendList?.list || [];
        console.log(
          TAG,
          ' FriendReducer-MAKE_FRIEND success id = ',
          id,
          ' - list length = ',
          list.length
        );
        if (id && !_.isEmpty(list)) {
          const index = list.findIndex(item => item.id === id);
          if (index >= 0) {
            list[index]['is_maked_friend'] = true;
          }
          console.log(
            TAG,
            ' FriendReducer-MAKE_FRIEND list index = ',
            list[index]
          );
          // friendList['list'] = list;

          return { ...state, friendList: friendList };
        }
      }
      console.log(TAG, ' FriendReducer-MAKE_FRIEND payload = ', payload);
      return state;
    }

    case ACTIONS.MAKE_INVITE: {
      const payload = action.payload || {};

      // if (!_.isEmpty(payload) && String(payload?.success) === '1') {
      //   console.log(
      //     TAG,
      //     ' FriendReducer-MAKE_INVITE success payload = ',
      //     payload
      //   );

      const { id, invited } = payload;
      let friendList = _.cloneDeep(state.friendList);
      let invitedlist = _.cloneDeep(state.invitedlist);

      let list = friendList?.list || [];
      if (id && !_.isEmpty(list)) {
        const index = list.findIndex(item => item.id === id);
        const index2 = invitedlist.findIndex(item => item.id === id);
        if (index >= 0) {
          list[index]['is_add_invited'] = true;
          if (index2 < 0) {
            invitedlist.push({ id: list[index].id });
          }
          if (index2 >= 0 && invited) {
            invitedlist.splice(index2, 1);
            list[index]['is_add_invited'] = false;
          }
        }

        // console.log(
        //   TAG,
        //   ' FriendReducer-MAKE_INVITE success payload = ',
        //   friendList
        // );
        return { ...state, friendList: friendList, invitedlist: invitedlist };
      }

      // }
      console.log(TAG, ' FriendReducer-MAKE_INVITE payload = ', payload);
      return state;
    }

    default:
      return state;
  }
};

export default FriendReducer;
