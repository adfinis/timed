import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "tracked-built-ins";

import analysisTableConfig from "timed/config/analysis-table";

const USER_SETTINGS_KEY = "user-settings";

export default class UserSettingsService extends Service {
  @tracked _overrides = {};

  static TABLE_MAP = {
    analysis: analysisTableConfig,
  };

  constructor(...args) {
    super(...args);
    this.loadTableConfigurations();
  }

  // helper functions for sub settings
  load(scope, defaultValue) {
    const fullKey = `${USER_SETTINGS_KEY}.${scope}`;
    const localStorageValue = localStorage.getItem(fullKey);
    if (!localStorageValue && typeof defaultValue !== "undefined") {
      localStorage.setItem(fullKey, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return localStorageValue ? JSON.parse(localStorageValue) : defaultValue;
  }

  save(scope, value) {
    const fullKey = `${USER_SETTINGS_KEY}.${scope}`;
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  clean(scope) {
    const fullKey = `${USER_SETTINGS_KEY}.${scope}`;
    localStorage.removeItem(fullKey);
  }

  getTableColumns(tableId) {
    const defaults = UserSettingsService.TABLE_MAP[tableId] || [];
    const tableOverrides = this._overrides[tableId] || {};

    return defaults.map((col) => {
      const userPreference = tableOverrides[col.label];
      return {
        ...col,
        isVisible:
          userPreference !== undefined ? userPreference.isVisible : true,
      };
    });
  }

  @action
  updateColumnVisibility(tableId, columnId, isVisible) {
    this._overrides = {
      ...this._overrides,
      [tableId]: {
        ...(this._overrides[tableId] || {}),
        [columnId]: { isVisible },
      },
    };
    this.save(`table.${tableId}`, this._overrides[tableId]);
  }

  loadTableConfigurations() {
    const keys = Object.keys(UserSettingsService.TABLE_MAP);
    for (const key of keys) {
      const data = this.load(`table.${key}`);
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
      this.save(`table.${key}`, this._overrides[key]);
    }
  }
}
