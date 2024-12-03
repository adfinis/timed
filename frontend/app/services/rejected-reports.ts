import Service, { service } from "@ember/service";
import type StoreService from "@ember-data/store";
import { macroCondition, isTesting } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import type NotifyService from "ember-notify";
import type CurrentUserService from "timed/services/current-user";

const INTERVAL_DELAY = 10 * 60000; // 10 Minutes

export default class RejectedReportsService extends Service {
  @service declare store: StoreService;

  @service declare currentUser: CurrentUserService;

  @service declare notify: NotifyService;

  @tracked amountReports = 0;
  @tracked intervalId;

  get hasReports() {
    return this.amountReports > 0;
  }

  constructor(...args) {
    super(...args);

    this.pollReports();

    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      this.intervalId = null;
    } else {
      this.intervalId = setInterval(
        this.pollReports.bind(this),
        INTERVAL_DELAY
      );
    }
  }

  async pollReports() {
    try {
      const reports = await this.store.query("report", {
        user: this.currentUser.user.id,
        editable: 1,
        rejected: 1,
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
    "rejected-reports": RejectedReportsService;
  }
}
