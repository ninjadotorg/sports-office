import { ACTIONS } from '@/actions/RaceAction';
import _ from 'lodash';
import { STATE_BLUETOOTH } from '@/utils/Constants';
import PeripheralBluetooth from '@/models/PeripheralBluetooth';

const TAG = 'RaceReducer';
const initialState = {
  isSavedDevice: false,
  state: STATE_BLUETOOTH.SCANNING,
  data: {}
};
const RaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CONNECT_BLUETOOTH: {
      const payload = action.payload || {};
      console.log(TAG, ' RaceReducer-CONNECT_BLUETOOTH payload = ', payload);
      return {
        ...state,
        state: payload?.state || STATE_BLUETOOTH.UNKNOWN,
        isSavedDevice: payload?.isSavedDevice || state?.isSavedDevice,
        data: payload?.data || {}
      };
    }
    case ACTIONS.CHECK_SAVING_DEVICE: {
      const payload = action.payload || {};
      console.log(TAG, ' RaceReducer-CHECK_SAVING_DEVICE payload = ', payload);
      return {
        ...state,
        isSavedDevice: payload?.isSavedDevice || false
      };
    }
    default:
      return state;
  }
};

export default RaceReducer;
