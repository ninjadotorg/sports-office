export default class PeripheralBluetooth {
  constructor(peripheral, service, characteristic) {
    this.peripheral = peripheral;
    this.service = service;
    this.characteristic = characteristic;
  }

  toJSON() {
    return {
      peripheral: this.peripheral,
      service: this.service,
      characteristic: this.characteristic
    };
  }
}
