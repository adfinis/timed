import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "tracked-built-ins";

import analysisTableConfig from "timed/config/analysis-table";

const keyFor = (scope) => `user-settings.${scope}`;

export default class UserSettingsService extends Service {
  @tracked _overrides = {};

  static TABLE_MAP = {
    analysis: analysisTableConfig,
  };

  constructor(...args) {
    super(...args);
    this.loadTableConfigurations();
  }

  load(scope, defaultValue) {
    const fullKey = keyFor(scope);
    const localStorageValue = localStorage.getItem(fullKey);
    if (!localStorageValue && typeof defaultValue !== "undefined") {
      localStorage.setItem(fullKey, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return localStorageValue ? JSON.parse(localStorageValue) : defaultValue;
  }

  save(scope, value) {
    const fullKey = keyFor(scope);
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  clean(scope) {
    localStorage.removeItem(keyFor(scope));
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
    const tableOverrides = this._overrides[tableId] || {};
    this._overrides = {
      ...this._overrides,
      [tableId]: {
        ...tableOverrides,
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
}
