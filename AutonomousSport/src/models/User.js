export default class User {
  constructor(userJson: JSON) {
    this.id = userJson?.id || -1;
    this.fullname = userJson?.fullname || '';
    this.email = userJson?.email || '';
    this.token = userJson?.token || '';
    this.photoUrl = userJson?.photoUrl || '';
    this.Profile = userJson?.Profile || userJson.profile || {};
    this.fbtoken = userJson?.fbtoken || '';
    this.fbuid = userJson?.fbuid || '';
    this.is_maked_friend = Number(userJson?.is_maked_friend) === 1 || false;
    this.is_add_invited = userJson?.is_add_invited || false;

    this.routeUnit = userJson?.routeUnit || 'mile';
  }

  get kcal() {
    return this.profile?.kcal || 0;
  }

  get route() {
    return this.profile?.miles || 0;
  }

  // get Profile() {
  //   return this.profile;
  // }

  get textRouteUnit() {
    return this.kcal > 1 ? `${this.routeUnit}s` : `${this.routeUnit}`;
  }

  toJSON() {
    return {
      id: this.id,
      fullname: this.fullname,
      email: this.email,
      token: this.token,
      fbtoken: this.fbtoken,
      fbuid: this.fbuid,
      is_maked_friend: this.is_maked_friend,
      photoUrl: this.photoUrl,
      Profile: this.Profile,
      route: this.route,
      is_add_invited: this.is_add_invited
    };
  }
}
