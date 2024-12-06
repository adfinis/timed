import { action } from "@ember/object";
import Service from "@ember/service";

const getHtml = () => document.querySelector("html");

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

const THEMES = /** @type {const} */ (["old", "regular"]);

export default class AppearanceService extends Service {
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
    const html = getHtml();
    this.setTheme(theme, html);
    this.setColorScheme(colorScheme, html);
  }

  /**
   * Sets dark or light mode
   * @param {"light" | "dark"} colorScheme
   * @param {ReturnType<getHtml>} html
   **/
  @action
  setColorScheme(colorScheme, html = null) {
    const _html = html ?? getHtml();
    localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);

    if (colorScheme === "light") {
      _html.classList.remove("dark");
      return;
    }
    _html.classList.add("dark");
  }

  /**
   * Sets regular or old color scheme
   * @param {typeof THEMES[number]} theme
   * @param {ReturnType<getHtml>} html
   **/
  @action
  setTheme(theme, html = null) {
    const _html = html ?? getHtml();
    localStorage.setItem(THEME_KEY, theme);

    if (_html.classList.contains(theme)) {
      return;
    }
    _html.classList.remove(...THEMES.filter((t) => t !== theme));
    _html.classList.add(theme);
  }

  @action
  toggleColorScheme() {
    this.setColorScheme(this.colorScheme === "dark" ? "light" : "dark");
  }

  @action
  cycleTheme() {
    const newTheme = THEMES[THEMES.indexOf(this.theme) + 1] ?? THEMES[0];
    this.setTheme(newTheme);
  }

  get theme() {
    return localStorage.getItem(THEME_KEY);
  }

  get colorScheme() {
    return localStorage.getItem(COLOR_SCHEME_KEY);
  }
}
