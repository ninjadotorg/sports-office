const TAG = 'CommandP2P';
export const COMMAND_P2P = {
  PLAY_VIDEO: 'PLAY_VIDEO',
  PAUSE_VIDEO: 'PAUSE_VIDEO',
  CHANGE_SCREEN: 'CHANGE_SCREEN'
};
export default class CommandP2P {
  constructor(action = '', data = {}) {
    this.action = action;
    this.data = data;
  }

  isPlayVideo = () => {
    return COMMAND_P2P.PLAY_VIDEO === this.action;
  };

  isPauseVideo = () => {
    return COMMAND_P2P.PAUSE_VIDEO === this.action;
  };

  toJSON() {
    return {
      action: this.action || '',
      data: this.data || {}
    };
  }
}
