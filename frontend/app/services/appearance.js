import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const getHtml = () => document.querySelector("html");

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

const THEMES = /** @type {const} */ (["old", "regular"]);
export const COLOR_SCHEME_LIGHT = "light";
export const COLOR_SCHEME_DARK = "dark";

export default class AppearanceService extends Service {
  @tracked _colorScheme;
  @tracked _theme;

  constructor(...args) {
    super(...args);
    this.loadConfiguration();
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

  /**
   * Sets dark or light mode
   * @param {"light" | "dark"} colorScheme
   * @param {ReturnType<getHtml>} html
   **/
  @action
  setColorScheme(colorScheme) {
    this._colorScheme = colorScheme;

    const html = getHtml();
    localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);

    if (colorScheme === COLOR_SCHEME_LIGHT) {
      html.classList.remove(COLOR_SCHEME_DARK);
      return;
    }
    html.classList.add(COLOR_SCHEME_DARK);
  }

  /**
   * Sets regular or old color scheme
   * @param {typeof THEMES[number]} theme
   * @param {ReturnType<getHtml>} html
   **/
  @action
  setTheme(theme) {
    this._theme = theme;

    const html = getHtml();
    localStorage.setItem(THEME_KEY, theme);

    if (html.classList.contains(theme)) {
      return;
    }
    html.classList.remove(...THEMES.filter((t) => t !== theme));
    html.classList.add(theme);
  }

  @action
  toggleColorScheme() {
    this.setColorScheme(
      this.colorScheme === COLOR_SCHEME_DARK
        ? COLOR_SCHEME_LIGHT
        : COLOR_SCHEME_DARK,
    );
  }

  @action
  cycleTheme() {
    const newTheme = THEMES[THEMES.indexOf(this.theme) + 1] ?? THEMES[0];
    this.setTheme(newTheme);
  }

  get theme() {
    return this._theme ?? localStorage.getItem(THEME_KEY);
  }

  get colorScheme() {
    return this._colorScheme ?? localStorage.getItem(COLOR_SCHEME_KEY);
  }
}
