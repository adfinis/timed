import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { hash } from "rsvp";

export default class SubscriptionsDetailRoute extends Route {
  @service timed;

  model(params) {
    const { project_id } = params;

    return hash({
      project: this.timed.getProjectDetails(project_id),
      reports: this.timed.getProjectReports(project_id),
      orders: this.timed.getProjectOrders(project_id),
    });
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    controller.setup(model);
  }
}
