import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "tracked-built-ins";

import config from "timed/config/environment";

const USER_SETTINGS_KEY = "user-settings";

const getHtml = () => document.querySelector("html");

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

const THEMES = /** @type {const} */ (["old", "regular"]);
const COLOR_SCHEME_LIGHT = "light";
const COLOR_SCHEME_DARK = "dark";

export default class UserSettingsService extends Service {
  @tracked _overrides = {};
  @tracked _colorScheme;
  @tracked _theme;

  static TABLE_MAP = {
    analysis: config.APP.analysisTable,
  };

  constructor(...args) {
    super(...args);
    this.loadConfiguration();
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

  loadConfiguration() {
    const colorScheme =
      this.colorScheme ??
      (window.matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light");
    const theme = this.theme ?? THEMES[0];
    this.setTheme(theme);
    this.setColorScheme(colorScheme);
  }

  setColorScheme(colorScheme) {
    this._colorScheme = colorScheme;

    const html = getHtml();
    this.save(COLOR_SCHEME_KEY, colorScheme);

    if (colorScheme === COLOR_SCHEME_LIGHT) {
      html.classList.remove(COLOR_SCHEME_DARK);
      return;
    }
    html.classList.add(COLOR_SCHEME_DARK);
  }

  setTheme(theme) {
    this._theme = theme;

    const html = getHtml();
    this.save(THEME_KEY, theme);

    if (html.classList.contains(theme)) {
      return;
    }
    html.classList.remove(...THEMES.filter((t) => t !== theme));
    html.classList.add(theme);
  }

  toggleColorScheme() {
    this.setColorScheme(
      this.colorScheme === COLOR_SCHEME_DARK
        ? COLOR_SCHEME_LIGHT
        : COLOR_SCHEME_DARK,
    );
  }

  cycleTheme() {
    const newTheme = THEMES[THEMES.indexOf(this.theme) + 1] ?? THEMES[0];
    this.setTheme(newTheme);
  }

  get theme() {
    return this._theme ?? this.load(THEME_KEY);
  }

  get colorScheme() {
    return this._colorScheme ?? this.load(COLOR_SCHEME_KEY);
  }
}
