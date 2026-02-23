/* eslint-disable ember/classic-decorator-no-classic-methods */
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const getHtml = () => document.querySelector("html")!;

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

const THEMES = ["old", "regular"] as const;
const COLOR_SCHEME_LIGHT = "light";
const COLOR_SCHEME_DARK = "dark";

type ColorScheme = typeof COLOR_SCHEME_LIGHT | typeof COLOR_SCHEME_DARK;
type Theme = (typeof THEMES)[number];

interface Mapping {
  theme: Theme;
  colorScheme: ColorScheme;
}

const LOCAL_STORAGE_MAP = {
  theme: "theme" as const,
  colorScheme: "color-scheme" as const,
} satisfies Record<keyof Mapping, string>;

export default class AppearanceService extends Service {
  @tracked declare _theme: Mapping["theme"];
  @tracked declare _colorScheme: Mapping["colorScheme"];

  loadConfiguration = () => {
    const colorScheme =
      this.colorScheme ??
      (window.matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light");
    const theme = this._theme ?? THEMES[0];

    this.setTheme(theme);
    this.setColorScheme(colorScheme);
  };

  #set = <K extends keyof Mapping>(name: K, value: (typeof this)[`_${K}`]) => {
    const k = `_${name}` as const;
    this[k] = value;
    localStorage.setItem(LOCAL_STORAGE_MAP[name], value);
  };

  setColorScheme = (colorScheme: ColorScheme) => {
    this.#set("colorScheme", colorScheme);

    if (colorScheme === COLOR_SCHEME_LIGHT) {
      getHtml().classList.remove(COLOR_SCHEME_DARK);
      return;
    }
    getHtml().classList.add(COLOR_SCHEME_DARK);
  };

  setTheme = (theme: Theme) => {
    this.#set("theme", theme);

    const html = getHtml();

    if (html.classList.contains(theme)) {
      return;
    }
    html.classList.remove(...THEMES.filter((t) => t !== theme));
    html.classList.add(theme);
  };

  toggleColorScheme = () => {
    this.setColorScheme(
      this.colorScheme === COLOR_SCHEME_DARK
        ? COLOR_SCHEME_LIGHT
        : COLOR_SCHEME_DARK,
    );
  };

  cycleTheme = () => {
    const newTheme = THEMES[THEMES.indexOf(this.theme) + 1] ?? THEMES[0];
    this.setTheme(newTheme);
  };

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
