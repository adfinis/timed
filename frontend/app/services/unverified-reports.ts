import Service, { service } from "@ember/service";
import type StoreService from "@ember-data/store";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import type NotifyService from "ember-notify";
import moment from "moment";
import type CurrentUserService from "timed/services/current-user";

const INTERVAL_DELAY = 10 * 60000; // 10 Minutes

/**
 * Unverified reports service
 *
 * This service polls reports of last month that need to be verified
 * by the current user.
 *
 * @class UnverifiedReportsService
 * @extends Ember.Service
 * @public
 */
export default class UnverifiedReportsService extends Service {
  @service declare store: StoreService;

  @service declare currentUser: CurrentUserService;

  @service declare notify: NotifyService;

  @tracked amountReports = 0;

  get hasReports() {
    return this.amountReports > 0;
  }

  get reportsToDate() {
    return moment().subtract(1, "month").endOf("month");
  }

  constructor(...args) {
    super(...args);

    this.pollReports();

    if (macroCondition(!isTesting())) {
      this.intervalId = setInterval(
        this.pollReports.bind(this),
        INTERVAL_DELAY
      );
    }
  }

  async pollReports() {
    try {
      const reports = await this.store.query("report", {
        to_date: this.reportsToDate.format("YYYY-MM-DD"),
        reviewer: this.currentUser.user.id,
        editable: 1,
        verified: 0,
        page: { number: 1, size: 1 },
      });

      this.amountReports = reports.meta.pagination.count;
    } catch (e) {
      this.notify.error("Error while polling reports");
    }
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}

declare module "@ember/service" {
  interface Registry {
    "unverified-reports": UnverifiedReportsService;
  }
}
