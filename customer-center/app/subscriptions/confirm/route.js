import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import ENV from "customer-center/config/environment";

export default class SubscriptionsConfirmRoute extends Route {
  @service timed;
  @service account;
  @service notify;
  @service intl;

  beforeModel(transition) {
    super.beforeModel(transition);

    if (!this.account.isInGroup(ENV.auth.roles.admin)) {
      this.notify.error(this.intl.t("page.subscriptions.confirm.no-access"));
      this.transitionTo("subscriptions.index");
    }
  }

  model() {
    return this.timed.getUnconfirmedOrders();
  }
}
