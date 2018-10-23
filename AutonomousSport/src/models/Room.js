const TAG = 'Room';
export default class Room {
  constructor(roomJson) {
    console.log(TAG, ' constructor roomJson = ', roomJson);
    this.id = roomJson?.id || -1;
    this.userId = roomJson?.userId || 0; // is mentor
    this.createdAt = roomJson?.createdAt || '';
    this.updatedAt = roomJson?.updatedAt || '';
    this.deletedAt = roomJson?.deletedAt || null;
    this.name = roomJson?.name || '';
    this.photo = roomJson?.photo || '';
    this.cover = roomJson?.cover || '';
    this.session = roomJson?.session || '';
    this.token = roomJson?.token || '';
    this.status = roomJson?.status || 0;
    this.loop = roomJson?.loop || 0;
    this.RoomPlayers = roomJson?.RoomPlayers || [];
    this.Map = roomJson?.Map || {};
    this.mapId = roomJson?.mapId || 0;
    this.miles = roomJson?.miles || 0;
  }

  getPathOfMap = (): [] => {
    try {
      const json = JSON.parse(this.Map?.datapoints);
      return json['points'] || [];
    } catch (error) {}
    return [];
  };

  getMapSize = (): { width: 0, height: 0 } => {
    const map = this.Map || { width: 0, height: 0 };
    return {
      width: map.width,
      height: map.height
    };
  };
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
      photo: this.photo,
      cover: this.cover,
      Map: this.Map,
      RoomPlayers: this.RoomPlayers || [],
      status: this.status,
      loop: this.loop,
      mapId: this.mapId,
      miles: this.miles
    };
  }
}
