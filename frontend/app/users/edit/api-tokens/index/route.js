import Route from "@ember/routing/route";

export default class UsersEditApiTokensIndexRoute extends Route {
  model() {
    return this.modelFor("users/edit");
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);
    controller.tokens.perform();
  }
}
