import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class SubscriptionsDetailOrdersRoute extends Route {
  @service timed;

  model() {
    return this.modelFor("subscriptions.detail");
  }

  setupController(controller, model) {
    super.setupController(...arguments);

    controller.setup(model);
  }
}
