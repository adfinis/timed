import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import ENV from "customer-center/config/environment";

export default class SubscriptionsListRoute extends Route {
  @service timed;
  @service account;

  beforeModel(transition) {
    super.beforeModel(transition);

    // Customers/users don't have access to the full list.
    if (
      !this.account.isInGroups("one", [
        ENV.auth.roles.employee,
        ENV.auth.roles.admin,
      ])
    ) {
      this.transitionTo("subscriptions.own");
    }
  }

  model() {
    return this.timed.getAllProjects();
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    controller.setup(model);
  }
}
