// { id: 15,
//   userId: 58,
//   createdAt: '2018-08-28T05:05:05.464079093Z',
//   updatedAt: '2018-08-28T05:05:05.464079093Z',
//   deletedAt: null,
//   name: 'Calop Pumbo',
//   photo: 'https://storage.googleapis.com/oskar-ai/110/calop_pumbo_cKNc071ADymBnwq4IAbt.png',
//   session: '2_MX40NjE1NDQyMn5udWxsfjE1MzU0MzI3MDUzNjV-bGtCZlBnV1ZXdUhkSktORm5VNHliaG84fn4',
//   token: 'T1==cGFydG5lcl9pZD00NjE1NDQyMiZzaWc9NDA5MmY2ZWRmOTA5NTgzZWRmYmI4ODZlMDQ3OWY3MGNiNDEyODNjNTpzZXNzaW9uX2lkPTJfTVg0ME5qRTFORFF5TW41dWRXeHNmakUxTXpVME16STNNRFV6TmpWLWJHdENabEJuVjFaWGRVaGtTa3RPUm01Vk5IbGlhRzg0Zm40JmNyZWF0ZV90aW1lPTE1MzU0MzI3MDUmbm9uY2U9Mzg5MDA4JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1MzU1MTkxMDU=',
//   status: 1,
//   mapId: 0,
//   loop: 2,
//   miles: 12 } }
export default class Room {
  constructor(roomJson) {
    this.id = roomJson?.id || -1;
    this.userId = roomJson?.userId || 0;
    this.createdAt = roomJson?.createdAt || '';
    this.updatedAt = roomJson?.updatedAt || '';
    this.deletedAt = roomJson?.deletedAt || null;
    this.name = roomJson?.name || '';
    this.photo = roomJson?.photo || '';
    this.session = roomJson?.session || '';
    this.token = roomJson?.token || '';
    this.status = roomJson?.status || 0;
    this.loop = roomJson?.loop || 0;
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
      photo :this.photo,
      status: this.status,
      loop: this.loop,
      mapId: this.mapId,
      miles: this.miles
    };
  }
}
