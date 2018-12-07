import _ from 'lodash';

export default class PeripheralBluetooth {
  constructor(peripheral, service, characteristic) {
    this.peripheral = peripheral;
    this.service = service;
    this.characteristic = characteristic;
  }

  static fromJson(json = {}) {
    if (!_.isEmpty(json)) {
      return new PeripheralBluetooth(
        json.peripheral,
        json.service,
        json.characteristic
      );
    }
    return null;
  }

  toJSON() {
    return {
      peripheral: this.peripheral,
      service: this.service,
      characteristic: this.characteristic
    };
  }
}
