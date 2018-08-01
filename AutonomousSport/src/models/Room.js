export default class Room {
  constructor(roomJson) {
    this.id = roomJson?.id || -1;
    this.userId = roomJson?.userId || 0;
    this.createdAt = roomJson?.createdAt || '';
    this.updatedAt = roomJson?.updatedAt || '';
    this.deletedAt = roomJson?.deletedAt || null;
    this.name = roomJson?.name || '';
    this.session = roomJson?.session || '';
    this.token = roomJson?.token || '';
    this.win = roomJson?.win || 0;
  }
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      name: this.name,
      session: this.session,
      token: this.token,
      win: this.win
    };
  }
}
