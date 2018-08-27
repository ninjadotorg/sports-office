export default class Map {
  constructor(mapJson) {
    this.id = mapJson?.id || -1;
    this.userId = mapJson?.userId || 0;
    this.createdAt = mapJson?.createdAt || '';
    this.updatedAt = mapJson?.updatedAt || '';
    this.deletedAt = mapJson?.deletedAt || null;
    this.name = mapJson?.name || '';
    this.photo = mapJson?.photo || '';
    this.mapgrap = mapJson?.mapgrap || '';
    this.miles = mapJson?.miles || '';
    this.status = mapJson?.status || 0;
  }
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      name: this.name,
      photo: this.photo,
      mapgrap: this.mapgrap,
      miles: this.miles,
      status: this.status
    };
  }
}
