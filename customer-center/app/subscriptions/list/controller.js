import { A } from "@ember/array";
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import { tracked } from "@glimmer/tracking";
import { saveAs } from "file-saver";
import moment from "moment";

import { formatDurationShort } from "customer-center/helpers/format-duration-short";

export default class SubscriptionsListController extends Controller {
  @service intl;

  @tracked projects;
  @tracked searches = {};
  @tracked sortBy = {};

  @action searchFor(key, query) {
    if (isEmpty(query)) {
      delete this.searches[key];
    } else {
      this.searches[key] = query;
    }

    this.search();
  }

  @action limitCritical(event) {
    const { checked } = event.target;

    if (checked) {
      this.searches.isTimeAlmostConsumed = "true";
    } else {
      delete this.searches.isTimeAlmostConsumed;
    }

    this.search();
  }

  @action search() {
    let projects = this._projects;

    for (const key in this.searches) {
      const normalized = String(this.searches[key]).trim().toLowerCase();

      if (isEmpty(normalized)) {
        continue;
      }

      projects = projects.filter((project) =>
        String(project.get(key)).toLowerCase().includes(normalized)
      );
    }

    this.projects = projects;
  }

  @action sort(key, direction = "ASC") {
    this.projects.sortBy(key);

    if (direction === "DESC") {
      this.projects.reverseObjects();
    }
  }

  @action sortDuration(key, direction = "ASC") {
    this.projects = A(
      this.projects.toArray().sort((a, b) => {
        return direction === "ASC" ? a[key] - b[key] : b[key] - a[key];
      })
    );
  }

  @action export() {
    const headings = [
      this.intl.t("page.subscriptions.list.table.customer"),
      this.intl.t("page.subscriptions.list.table.project"),
      this.intl.t("page.subscriptions.list.table.billing"),
      this.intl.t("page.subscriptions.list.table.cost-center-number"),
      this.intl.t("page.subscriptions.list.table.cost-center-name"),
      this.intl.t("page.subscriptions.list.table.time-purchased"),
      this.intl.t("page.subscriptions.list.table.time-spent"),
      this.intl.t("page.subscriptions.list.table.time-remaining"),
      this.intl.t("page.subscriptions.list.table.time-unconfirmed"),
    ].join(",");

    const lines = this.projects
      .toArray()
      .map((project) => {
        // Example cost center name: 12345 EXPENSE
        const costCenterFullName = project.get("costCenter.name");
        let costCenterSplitName = [];
        if (costCenterFullName) {
          costCenterSplitName = costCenterFullName
            .trim()
            .match(/^(\S*\d{5}\S*) (.+)$/);
        }

        return [
          project.get("customer.name"),
          project.get("name"),
          project.get("billingType.name"),
          ...(costCenterFullName
            ? [costCenterSplitName[1], costCenterSplitName[2].trim()]
            : ["", ""]),
          formatDurationShort(project.get("purchasedTime")),
          formatDurationShort(project.get("spentTime")),
          formatDurationShort(project.get("totalTime")),
          formatDurationShort(project.get("unconfirmedTime")),
        ];
      })
      .map((line) => line.join(","))
      .join("\n");

    const name = `cc-subscriptions-${moment().format("YYYY-MM-DD HH:mm")}.csv`;
    const blob = new Blob([`${headings}\n${lines}`], {
      type: "text/csv;charset=utf-8",
    });

    saveAs(blob, name);
  }

  setup(model, transition) {
    this.projects = model;
    this._projects = model;

    this.searches = [];
    this.sortBy = {};
  }
}
