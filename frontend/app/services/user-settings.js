import Service from "@ember/service";
import { TrackedObject } from "tracked-built-ins";

const USER_SETTINGS_KEY = "user-settings";

export default class UserSettingsService extends Service {
  tableConfigCache = new TrackedObject({
    // "example-key": {
    //   all: [],
    //   hidden: [],
    // },
  });

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

  ensureConfigCachePrepared(tableKey) {
    if (this.tableConfigCache[tableKey] === undefined) {
      this.tableConfigCache[tableKey] = {
        all: [],
        hidden: [],
      };
    }
  }
  // end helper function

  prepareTableColumns(tableKey, defaultColumns) {
    if (!Array.isArray(defaultColumns) || !defaultColumns.length) {
      console.error("No Default Colimns provided");
      return;
    }
    this.ensureConfigCachePrepared(tableKey);
    this.tableConfigCache[tableKey].all = defaultColumns;
    this._loadHiddenColumns(tableKey);
  }

  getTableColumns(tableKey) {
    this.ensureConfigCachePrepared(tableKey);
    return this.tableConfigCache[tableKey].all.filter(
      (column) =>
        !this.tableConfigCache[tableKey].hidden.includes(column.label),
    );
  }

  getAllTableColumns(tableKey) {
    this.ensureConfigCachePrepared(tableKey);
    return this.tableConfigCache[tableKey].all;
  }

  getHiddenColumns(tableKey) {
    this.ensureConfigCachePrepared(tableKey);
    return this.tableConfigCache[tableKey].hidden;
  }

  _loadHiddenColumns(tableKey) {
    this.ensureConfigCachePrepared(tableKey);
    this.tableConfigCache[tableKey].hidden = this.load(tableKey, []);
  }

  updateHiddenColumns(tableKey, hiddenLabels) {
    this.ensureConfigCachePrepared(tableKey);
    this.tableConfigCache[tableKey].hidden = hiddenLabels;
    this.save(tableKey, hiddenLabels);
  }
}
