import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class SubscriptionsOwnRoute extends Route {
  @service timed;

  model() {
    return this.timed.getOwnProjects();
  }
}
