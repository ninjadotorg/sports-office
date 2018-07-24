import { Config } from '@/utils/Constants';

export default class Api {
  static SIGN_IN = `${Config.API_URL}/api/auth`;
  static SIGN_UP = `${Config.API_URL}/api/signup`;
  static INIT_HANDSHAKE = `${Config.API_URL}/api/handshake/init`;
  static GET_LIST_ROOM = `${Config.API_URL}/api/room/list`;
  static CREATE_ROOM = `${Config.API_URL}/api/room/session/create`;
  static JOIN_ROOM = `${Config.API_URL}/api/room/session/create`;
}
