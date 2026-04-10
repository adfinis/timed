import Service, { service } from "@ember/service";

import userSubServiceLoader from "timed/utils/user-settings/loader";

const USER_SETTINGS_KEY = "user-settings";

export default class UserSettingsService extends Service {
  @service notify;
  #subServices = {};

  constructor(...args) {
    super(...args);
    this.#subServices = userSubServiceLoader(this);
  }

  of(subService) {
    const instance = this.#subServices[subService];
    if (!instance) {
      this.notify.danger(`${subService} service is not exisits`);
    }
    return instance;
  }

  // helper functions for sub settings
  load(subServiceKey, defaultValue) {
    const fullKey = `${USER_SETTINGS_KEY}.${subServiceKey}`;
    const localStorageValue = localStorage.getItem(fullKey);
    if (!localStorageValue && typeof defaultValue !== "undefined") {
      localStorage.setItem(fullKey, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return localStorageValue ? JSON.parse(localStorageValue) : defaultValue;
  }

  save(subServiceKey, value) {
    const fullKey = `${USER_SETTINGS_KEY}.${subServiceKey}`;
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  clean(subServiceKey) {
    const fullKey = `${USER_SETTINGS_KEY}.${subServiceKey}`;
    localStorage.removeItem(fullKey);
  }
}
