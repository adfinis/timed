import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class SubscriptionsDetailIndexRoute extends Route {
  @service timed;

  model() {
    return this.modelFor("subscriptions.detail");
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    controller.setup(model);
  }
}
