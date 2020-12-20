import { observable, configure, action } from "mobx";

configure({enforceActions: 'observed'});

class Reload {
  @observable liveReload: number = 0;
  @observable videoReload: number = 0;

  @action.bound
  update(key: 'liveReload' | 'videoReload', value: number) {
    this[key] = value
  }
}

export default new Reload()