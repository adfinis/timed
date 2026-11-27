/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import { getOwner } from "@ember/application";
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { DateTime } from "luxon";

/**
 * The index activities controller
 *
 * @class IndexActivitiesController
 * @extends Ember.Controller
 * @public
 */
export default class ActivitiesIndexController extends Controller {
  @service router;
  @service store;
  @service notify;
  @service tracking;
  @service fetch;
  @service currentUser;

  @tracked showUnknownWarning = false;
  @tracked showOverlappingWarning = false;

  /**
   * All activities currently in the store
   *
   * @property {Activity[]} _allActivities
   * @private
   */
  get _allActivities() {
    return this.store.peekAll("activity");
  }

  /**
   * The ID of the currently selected activity.
   * This is used to add a CSS class for styling.
   *
   * @property {String} editId
   * @public
   */
  get editId() {
    return this.router.currentRoute.params.id;
  }

  /**
   * The activities filtered by the selected day
   *
   * @property {Activity[]} activities
   * @public
   */
  get activities() {
    return this._allActivities.filter((activity) => {
      return (
        activity.get("date") &&
        activity.get("date").hasSame(this.model, "day") &&
        activity.get("user.id") === this.currentUser.user.id &&
        !activity.get("isNew") &&
        !activity.get("isDeleted")
      );
    });
  }

  get sortedActivities() {
    return this.activities.toSorted((a, b) => {
      return b.from - a.from;
    });
  }

  /**
   * Edit the clicked activity or exit the edit mask if the activity is
   * already being edited.
   *
   * @method editActivity
   * @param {Activity} activity The activity to edit
   * @public
   */
  @action
  editActivity(activity) {
    if (!activity.get("transferred")) {
      const { id } = this.router.currentRoute.params;

      if (id === activity.get("id")) {
        this.router.transitionTo("index.activities");
      } else {
        this.router.transitionTo("index.activities.edit", activity.get("id"));
      }
    }
  }

  /**
   * Start an activity
   *
   * @method startActivity
   * @param {Activity} activity The activity to start
   * @public
   */
  @action
  async startActivity(activity, event) {
    event.stopPropagation();

    if (!activity.get("date").hasSame(DateTime.now(), "day")) {
      activity = this.store.createRecord("activity", {
        task: await activity.task,
        comment: await activity.comment,
      });
    }

    await this.tracking.stopActivity.perform();

    this.tracking.activity = activity;

    await this.tracking.startActivity.perform();

    this.router.transitionTo("index.activities", {
      queryParams: { day: DateTime.now().toISODate() },
    });
  }

  /**
   * Stop an activity
   *
   * @method stopActivity
   * @param {Activity} activity The activity to stop
   * @public
   */
  @action
  stopActivity(activity, event) {
    event.stopPropagation();

    this.tracking.activity = activity;

    this.tracking.stopActivity.perform();
  }

  /**
   * Checks if warning concerning unknown tasks should be displayed
   *
   * @method generateReportsCheck
   * @public
   */
  @action
  generateReportsCheck() {
    const hasUnknown = !!this.activities.find((a) => !a.task.get("id"));
    const hasOverlapping = !!this.sortedActivities.find((a) => {
      return a.get("active") && !a.get("from").hasSame(DateTime.now(), "day");
    });

    this.showUnknownWarning = hasUnknown;
    this.showOverlappingWarning = hasOverlapping;

    if (!hasUnknown && !hasOverlapping) {
      this.generateReports();
    }
  }

  /**
   * Generates reports from the current list of activities
   *
   * @method generateReports
   * @public
   */
  @action
  async generateReports() {
    this.showUnknownWarning = false;
    this.showOverlappingWarning = false;
    this.tracking.generatingReports = true;

    try {
      await this.fetch.fetch("/api/v1/reports/generate", {
        method: "POST",
        body: {
          date: this.model.toISODate(),
        },
        headers: {
          "content-type": "application/json",
        },
      });

      ["activity", "report"].forEach((type) => {
        this.store
          .peekAll(type)
          .filter(
            (thing) =>
              thing.user.id === this.currentUser.user.id &&
              thing.date === this.model,
          )
          .forEach((record) => this.store.unloadRecord(record));
      });

      const indexRoute = getOwner(this).lookup("route:index");
      indexRoute.lastUpdateDate = null;
      await this.router.refresh("index");
      this.router.transitionTo("index.reports");
    } catch {
      this.notify.error("Error while generating reports");
    } finally {
      this.tracking.generatingReports = false;
    }
  }
}
