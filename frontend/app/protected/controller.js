import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { keyResponder, onKey } from "ember-keyboard";

const getHtml = () => document.querySelector("html");

const COLOR_SCHEME_KEY = "color-scheme";
const THEME_KEY = "theme";

/**
 * Sets dark or light mode
 * @param {"light" | "dark"} colorScheme
 * @param {ReturnType<getHtml>} html
 **/
const setColorScheme = (colorScheme, html = null) => {
  const _html = html ?? getHtml();
  localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);

  if (colorScheme === "light") {
    _html.classList.remove("dark");
    return;
  }
  _html.classList.add("dark");
};

const THEMES = /** @type {const} */ (["old", "regular"]);

/**
 * Sets regular or old color scheme
 * @param {typeof THEMES[number]} theme
 * @param {ReturnType<getHtml>} html
 **/
const setTheme = (theme, html = null) => {
  const _html = html ?? getHtml();
  localStorage.setItem(THEME_KEY, theme);

  if (_html.classList.contains(theme)) {
    return;
  }
  _html.classList.remove(...THEMES.filter((t) => t !== theme));
  _html.classList.add(theme);
};

const loadConfiguration = () => {
  const colorScheme =
    localStorage.getItem(COLOR_SCHEME_KEY) ??
    (window.matchMedia("(prefers-color-scheme:dark)").matches
      ? "dark"
      : "light");
  const theme = localStorage.getItem(THEME_KEY) ?? THEMES[0];
  const html = getHtml();
  setTheme(theme, html);
  setColorScheme(colorScheme, html);
};

const toggleColorScheme = () =>
  setColorScheme(
    localStorage.getItem(COLOR_SCHEME_KEY) === "dark" ? "light" : "dark"
  );

const cycleTheme = () => {
  const currentTheme = localStorage.getItem(THEME_KEY);
  const newTheme = THEMES[THEMES.indexOf(currentTheme) + 1] ?? THEMES[0];
  setTheme(newTheme);
};

@keyResponder
export default class ProtectedController extends Controller {
  @service notify;
  @service router;
  @service session;
  @service currentUser;
  @service("autostart-tour") autostartTour;
  @service tour;

  @tracked visible;
  @tracked loading;

  /**
   * Invalidate the session
   *
   * @method invalidateSession
   * @public
   */
  @action
  async invalidateSession() {
    this.autostartTour.done = [];

    await this.session.invalidate();

    this.router.transitionTo("login");
  }

  /**
   * Never start the tour, set the tour done property on the current user
   *
   * @method neverTour
   * @public
   */
  @action
  async neverTour() {
    try {
      const user = this.currentUser.user;
      user.tourDone = true;
      await user.save();
      this.visible = false;
    } catch (error) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the user");
    }
  }

  /**
   * Skip the tour for now
   *
   * @method laterTour
   * @public
   */
  @action
  laterTour() {
    this.autostartTour.done = this.autostartTour.tours;
    this.visible = false;
  }

  /**
   * Start the tour
   *
   * @method startTour
   * @public
   */
  @action
  startTour() {
    this.autostartTour.done = [];
    this.visible = false;

    this.tour.prepare(this.currentUser.user);
    this.tour.startTour();
  }

  constructor(...args) {
    super(...args);
    loadConfiguration();
  }

  @onKey("ctrl+,")
  _toggleColorScheme(e) {
    e.preventDefault();
    toggleColorScheme();
  }

  @onKey("ctrl+.")
  _cycleTheme(e) {
    e.preventDefault();
    cycleTheme();
  }
}
