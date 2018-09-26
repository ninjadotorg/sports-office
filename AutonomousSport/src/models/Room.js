export default class Room {
  constructor(roomJson) {
    this.id = roomJson?.id || -1;
    this.userId = roomJson?.userId || 0;
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
