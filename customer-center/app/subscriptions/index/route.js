import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

import ENV from "customer-center/config/environment";

export default class SubscriptionsIndexRoute extends Route {
  @service account;

  beforeModel() {
    super.beforeModel(...arguments);

    /**
     * Only admins get the full list while customers/users
     * get a simple overview over their own projects.
     */
    if (this.account.isInGroup(ENV.auth.customerRole)) {
      this.transitionTo("subscriptions.own");
    } else {
      this.transitionTo("subscriptions.list");
    }
  }
}
