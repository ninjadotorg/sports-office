import { ACTIONS } from '@/actions/P2PAction';
import _ from 'lodash';

const TAG = 'P2PReducer';
const initialState = {
  command: {}
};
const P2PReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFY_MESSAGE: {
      const payload = action.payload || {};

      return {
        ...state,
        command: payload
      };
    }

    default:
      return state;
  }
};

export default P2PReducer;
