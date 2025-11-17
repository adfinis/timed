import Controller from "@ember/controller";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency";

export default class SubscriptionsDetailIndexController extends Controller {
  @service account;
  @service intl;
  @service timed;

  @tracked project;
  @tracked reports;
  @tracked reportsNext;

  @dropTask *fetchNextReports() {
    try {
      this.reportsPage++;
      const reports = yield this.timed.getProjectReports(
        this.project.id,
        this.reportsPage
      );
      this.reports.pushObjects(reports.toArray());

      this.reportsNext = Boolean(get(reports, "links.next"));
    } catch (error) {
      console.error(error);
      this.reportsNext = false;
    }
  }

  setup(model, transition) {
    this.project = model.project;

    this.reports = model.reports.toArray();
    this.reportsPage = 1;
    this.reportsNext = Boolean(get(model, "reports.links.next"));
  }
}
