import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const getHtml = () => document.querySelector("html")!;

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

const THEMES = ["old", "regular"] as const;
const COLOR_SCHEME_LIGHT = "light";
const COLOR_SCHEME_DARK = "dark";

type ColorScheme = "light" | "dark";
type Theme = (typeof THEMES)[number];

export default class AppearanceService extends Service {
  @tracked declare _colorScheme: ColorScheme;
  @tracked declare _theme: Theme;

  loadConfiguration() {
    const colorScheme =
      this.colorScheme ??
      (window.matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light");
    const theme = this._theme ?? THEMES[0];
    this.setTheme(theme);
    this.setColorScheme(colorScheme);
  }

  /**
   * Sets dark or light mode
   **/
  @action
  setColorScheme(colorScheme: ColorScheme) {
    this._colorScheme = colorScheme;

    localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);

    if (colorScheme === COLOR_SCHEME_LIGHT) {
      getHtml().classList.remove(COLOR_SCHEME_DARK);
      return;
    }
    getHtml().classList.add(COLOR_SCHEME_DARK);
  }

  /**
   * Sets regular or old color scheme
   **/
  @action
  setTheme(theme: Theme) {
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

declare module "@ember/service" {
  interface Registry {
    appearance: AppearanceService;
  }
}
