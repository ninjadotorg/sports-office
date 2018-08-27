export default class User {
  constructor(userJson: JSON) {
    this.id = userJson?.id || -1;
    this.fullname = userJson.fullname || '';
    this.email = userJson.email || '';
    this.token = userJson.token || '';
    this.photoUrl = userJson.photoUrl || '';
    this.profile = userJson.Profile || {};

    this.routeUnit = userJson.routeUnit || 'mile';
  }

  get kcal() {
    return this.profile?.kcal || 0;
  }

  get route() {
    return this.profile?.miles || 0;
  }

  get Profile() {
    return this.profile;
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
      photoUrl: this.photoUrl,
      profile: this.profile,
      route: this.route
    };
  }
}
