import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

import config from "timed/config/environment";

const USER_SETTINGS_KEY = "user-settings";

export default class UserSettingsService extends Service {
  @tracked _overrides = {};

  static TABLE_MAP = {
    analysis: config.APP.analysisTable,
  };

  constructor(...args) {
    super(...args);
    this._loadSettings();
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

  getTableColumns(tableId) {
    const defaults = UserSettingsService.TABLE_MAP[tableId] || [];
    const tableOverrides = this._overrides[tableId] || {};

    return defaults.map((col) => {
      const userPreference = tableOverrides[col.id];
      return {
        ...col,
        isVisible:
          userPreference !== undefined ? userPreference : col.isVisible,
      };
    });
  }

  @action
  updateColumnVisibility(tableId, columnId, isVisible) {
    // Update the tracked object reference to trigger reactivity
    this._overrides = {
      ...this._overrides,
      [tableId]: {
        ...(this._overrides[tableId] || {}),
        [columnId]: isVisible,
      },
    };
    this._persist();
  }

  _loadSettings() {
    const keys = Object.keys(UserSettingsService.TABLE_MAP);
    for (const key of keys) {
      const data = this.load(key);
      if (data) {
        try {
          this._overrides[key] = data;
        } catch (e) {
          console.error("UserSettings: Could not parse localStorage data", e);
        }
      }
    }
  }

  _persist() {
    const keys = Object.keys(UserSettingsService.TABLE_MAP);
    for (const key of keys) {
      this.save(key, this._overrides[key]);
    }
  }
}
