import User from '@/models/User';

const TAG = 'User';
export default class Player extends User {
  constructor(userJson: JSON) {
    super(userJson);
    this.speed = userJson?.speed || 0;
    this.playerName = userJson.playerName || '';
    this.goal = userJson.goal || '';
    this.archivement = userJson.archivement || 0;
    this.streamId = userJson.streamId || 0;
    this.isMe = userJson.isMe || false;
    console.log(
      TAG,
      ' contructor streamId = ',
      this.streamId,
      ' playerName = ',
      this.playerName
    );
  }

  toJSON() {
    return {
      playerName: this.playerName,
      speed: this.speed,
      streamId: this.streamId,
      goal: this.goal,
      archivement: this.archivement
    };
  }
}
