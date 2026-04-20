import { tracked } from "@glimmer/tracking";

const getHtml = () => document.querySelector("html");

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

const THEMES = /** @type {const} */ (["old", "regular"]);
const COLOR_SCHEME_LIGHT = "light";
const COLOR_SCHEME_DARK = "dark";

export default class Appearance {
  userSettings;
  @tracked _colorScheme;
  @tracked _theme;

  constructor(userSettings) {
    this.userSettings = userSettings;
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
  setColorScheme(colorScheme) {
    this._colorScheme = colorScheme;

    const html = getHtml();
    this.userSettings.save(COLOR_SCHEME_KEY, colorScheme);

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
  setTheme(theme) {
    this._theme = theme;

    const html = getHtml();
    this.userSettings.save(THEME_KEY, theme);

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
    return this._theme ?? this.userSettings.load(THEME_KEY);
  }

  get colorScheme() {
    return this._colorScheme ?? this.userSettings.load(COLOR_SCHEME_KEY);
  }
}
