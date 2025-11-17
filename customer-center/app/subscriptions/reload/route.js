import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import ENV from "customer-center/config/environment";

export default class SubscriptionsReloadRoute extends Route {
  @service timed;
  @service account;
  @service notify;
  @service intl;

  beforeModel(transition) {
    super.beforeModel(transition);

    // Employees and customers cannot recharge the subscription.
    if (!this.account.isInGroups("one", [ENV.auth.adminRole])) {
      this.notify.error(this.intl.t("page.subscriptions.reload.no-access"));
      this.transitionTo(
        "subscriptions.detail",
        transition.to.params.project_id
      );
    }
  }

  async model(params) {
    const project = await this.timed.getProjectDetails(params.project_id);

    return {
      project,
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    controller.setup(model);
  }
}
