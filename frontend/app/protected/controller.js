import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { keyResponder, onKey } from "ember-keyboard";

@keyResponder
export default class ProtectedController extends Controller {
  @service notify;
  @service router;
  @service session;
  @service currentUser;
  @service("autostart-tour") autostartTour;
  @service tour;
  @service appearance;

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
    } catch {
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
    this.appearance.loadConfiguration();
  }

  @onKey("ctrl+,")
  _toggleColorScheme(e) {
    e.preventDefault();
    this.appearance.toggleColorScheme();
  }

  @onKey("ctrl+.")
  _cycleTheme(e) {
    e.preventDefault();
    this.appearance.cycleTheme();
  }
}
