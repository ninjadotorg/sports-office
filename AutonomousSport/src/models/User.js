export default class User {
  constructor(userJson) {
    this.id = userJson?.id || -1;
    this.username = userJson.username || '';
    this.email = userJson.email || '';
    this.token = userJson.token || '';
  }
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      token: this.token
    };
  }
}
