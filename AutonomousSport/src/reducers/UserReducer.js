import { ACTIONS } from '@/actions/UserAction';
import { ACTIONS as ACTIONS_FRIEND } from '@/actions/FriendAction';
import _ from 'lodash';
import LocalDatabase from '@/utils/LocalDatabase';
import ApiService from '@/services/ApiService';

const TAG = 'UserReceducer';
const initialState = {
  userInfo: {},
  practiceInfo: {},
  firebaseInfo: {},
  topRacer: {}
};
const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.AUTH_LOGOUT: {
      return initialState;
    }
    case ACTIONS.AUTH_LOGIN: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        ApiService.token = payload.token;
        LocalDatabase.saveUserInfo(JSON.stringify(payload));
      }
      return { ...state, userInfo: payload };
    }

    case ACTIONS.AUTH_UPDATE: {
      break;
    }
    case ACTIONS.GET_USER: {
      const payload = action.payload || {};
      const practiceInfo = action.payloadPracticeInfo || {};
      if (!_.isEmpty(payload)) {
        console.log(TAG, ' UserReducer-GET_USER payload = ', payload);
        ApiService.token = payload.token;
      }
      return { ...state, userInfo: payload, practiceInfo: practiceInfo };
    }
    case ACTIONS.UPDATE_USER_NAME: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        console.log(TAG, ' UserReducer-UPDATE_USER_NAME payload = ', payload);
        // save local
        LocalDatabase.saveUserInfo(JSON.stringify(payload));
      }
      return { ...state, userInfo: payload };
    }
    case ACTIONS.UPDATE_USER_PASSWORD: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload)) {
        console.log(TAG, ' UserReducer-UPDATE_USER_NAME payload = ', payload);
        // save local
        LocalDatabase.saveUserInfo(JSON.stringify(payload));
      }
      return { ...state, userInfo: payload };
    }

    case ACTIONS.UPDATE_PRACTISE_RACING: {
      const payload = action.payload || {};
      return { ...state, practiceInfo: payload };
    }
    case ACTIONS.UPDATE_RACING: {
      const payload = action.payload || {};
      return { ...state, userInfo: payload };
    }
    case ACTIONS.SIGNIN_WITH_FIREBASE: {
      const payload = action.payload || {};
      return { ...state, firebaseInfo: payload };
    }
    case ACTIONS.RESET_RACING: {
      const payload = action.payload || {};
      return { ...state, practiceInfo: payload };
    }
    case ACTIONS_FRIEND.MAKE_FRIEND: {
      const payload = action.payload || {};
      if (!_.isEmpty(payload) && String(payload?.success) === '1') {
        const { id } = payload;
        const topRace = _.cloneDeep(state.topRacer) || {};
        let list = topRace?.list || [];
        if (id && !_.isEmpty(list)) {
          const index = list.findIndex(item => item.id === id);
          if (index >= 0) {
            list[index]['is_maked_friend'] = true;
          }

          return { ...state, topRacer: topRace };
        }
      }
      return state;
    }
    case ACTIONS.GET_TOP_RACER: {
      const payload = action.payload || {};
      const data = {
        ...payload,
        status: payload.hasOwnProperty('list')
      };
      return { ...state, topRacer: data };
    }
    default:
      return state;
  }
};

export default UserReducer;
