import User from '@/models/User';

const TAG = 'Player';
export const FBUID_TEMPLATE = 'fbuid';
export default class Player extends User {
  constructor(userJson: JSON) {
    super(userJson);
    this.speed = userJson?.speed || 0;
    this.playerName = userJson?.playerName || this.fullname;
    this.goal = userJson?.goal || '';
    this.archivement = userJson?.archivement || 0;
    this.streamId = userJson?.streamId || 0;
    this.isMe = userJson?.isMe || false;
    this.userId = userJson?.userId;
    this.fbuid = this.userId ? `${FBUID_TEMPLATE}${this.userId}` : '';
    // console.log(
    //   TAG,
    //   ' contructor streamId = ',
    //   this.streamId,
    //   ' playerName = ',
    //   this.playerName
    // );
  }
  messageToPublish = () => {
    return {
      userId: this.userId,
      playerName: this.playerName,
      speed: this.speed,
      streamId: this.streamId,
      goal: this.goal,
      archivement: this.archivement
    };
  };

  toJSON() {
    return {
      userId: this.userId,
      playerName: this.playerName,
      speed: this.speed,
      streamId: this.streamId,
      goal: this.goal,
      isMe: this.isMe,
      archivement: this.archivement
    };
  }
}
