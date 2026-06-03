/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import { DateTime } from "luxon";

/**
 * The index route
 *
 * @class IndexRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexRoute extends Route {
  @service currentUser;

  lastUpdateDate = null;

  queryParams = {
    day: {
      refreshModel: true,
    },
  };

  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  @service session;
  @service store;

  /**
   * Model hook, return the selected day as luxon object
   *
   * @method model
   * @param {Object} params The query params
   * @param {String} params.day The selected day
   * @return {DateTime} The selected day as luxon object
   * @public
   */
  model({ day }) {
    return day ? DateTime.fromISO(day) : DateTime.now().startOf("day");
  }

  /**
   * After model hook, fetch all activities, attendances and reports of the
   * selected day, toghether with necessary data related to them.
   *
   * @method afterModel
   * @param {DateTime} model The selected day
   * @return {Promise} A promise which resolves after all data is fetched
   * @public
   */
  afterModel(model) {
    const formattedDate = model.toISODate();
    if (formattedDate === this.lastUpdateDate) {
      return;
    }

    this.lastUpdateDate = formattedDate;

    const userId = this.currentUser.user.id;
    const day = formattedDate;
    const from = model.minus({ days: 32 }).toISODate();
    const to = model.plus({ days: 16 }).toISODate();
    const location = this.store
      .peekRecord("user", userId)
      .get("activeEmployment.location.id");

    return Promise.all([
      this.store.query("activity", {
        include: "task,task.project,task.project.customer",
        day,
      }),
      this.store.query("attendance", { date: day }),
      this.store.query("absence-type", {}),
      this.store.query("report", {
        include: "task,task.project,task.project.customer,verified-by",
        date: day,
        user: userId,
      }),
      this.store.query("report", {
        from_date: from,
        to_date: to,
        user: userId,
      }),
      this.store.query("absence", {
        from_date: from,
        to_date: to,
        user: userId,
      }),
      this.store.query("public-holiday", {
        from_date: from,
        to_date: to,
        location,
      }),
    ]);
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.date = model;
    controller.setCenter.perform(model);

    controller.set("newAbsence", {
      dates: [model],
      comment: "",
      absenceType: null,
    });
  }
}
