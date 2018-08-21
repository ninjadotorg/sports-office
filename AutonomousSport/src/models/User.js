export default class User {
  constructor(userJson: JSON) {
    this.id = userJson?.id || -1;
    this.fullname = userJson.fullname || '';
    this.email = userJson.email || '';
    this.token = userJson.token || '';
    this.kcal = userJson.kcal || 0;
    this.route = userJson.route || 0;
    this.routeUnit = userJson.routeUnit || 'mile';
  }

  get textRouteUnit() {
    return this.kcal > 1 ? `${this.routeUnit}s` : `${this.routeUnit}`;
  }

  toJSON() {
    return {
      id: this.id,
      fullname: this.fullname,
      email: this.email,
      token: this.token,
      kcal: this.kcal,
      route: this.route
    };
  }
}
