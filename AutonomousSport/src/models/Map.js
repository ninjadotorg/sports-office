export default class Map {
  constructor(mapJson) {
    this.id = mapJson?.id || -1;
    this.userId = mapJson?.userId || 0;
    this.createdAt = mapJson?.createdAt || '';
    this.updatedAt = mapJson?.updatedAt || '';
    this.deletedAt = mapJson?.deletedAt || null;
    this.name = mapJson?.name || '';
    this.photo = mapJson?.photo || '';
    this.cover = mapJson?.cover || '';
    this.mapgrap = mapJson?.mapgrap || '';
    this.miles = mapJson?.miles || '';
    this.datapoints = mapJson?.datapoints || {};
    this.width = mapJson?.width || 0;
    this.height = mapJson.height || 0;
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
      cover: this.cover || '',
      photo: this.photo,
      width: this.width,
      datapoints: this.datapoints || {},
      height: this.height,
      mapgrap: this.mapgrap,
      miles: this.miles,
      status: this.status
    };
  }
}
