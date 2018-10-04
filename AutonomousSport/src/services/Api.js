import { Config } from '@/utils/Constants';

export default class Api {
  //forGotPass
  static FORGOT_PASS = `${Config.API_URL}/api/forgot-pass`;
  static SIGN_IN = `${Config.API_URL}/api/auth`;
  static UPDATE_NAME = `${Config.API_URL}/api/user/update`;
  static SIGN_UP = `${Config.API_URL}/api/signup`;
  static INIT_HANDSHAKE = `${Config.API_URL}/api/handshake/init`;
  static GET_LIST_ROOM = `${Config.API_URL}/api/room/list`;
  static GET_ALL_USER = `${Config.API_URL}/api/user/list`;
  static GET_ALL_FRIEND = `${Config.API_URL}/api/friend/list`;
  static GET_ALL_MAP = `${Config.API_URL}/api/map/list`;
  static CREATE_ROOM = `${Config.API_URL}/api/room/session/create`;
  static LEFT_ROOM = `${Config.API_URL}/api/room/session/leave`;
  static JOIN_ROOM = `${Config.API_URL}/api/room/session/create-token`;
  static MAKE_FRIEND = `${Config.API_URL}/api/friend/add`;
  static JOIN_RANDOM_ROOM = `${Config.API_URL}/api/room/session/random`; 
  static START_RACING = `${Config.API_URL}/api/room/session/action`; 
}
