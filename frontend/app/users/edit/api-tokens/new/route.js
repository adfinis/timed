import Route from "@ember/routing/route";

export default class UsersEditApiTokensNewRoute extends Route {
  model = () => null;

  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.token.perform();
  }

  resetController(controller, ...args) {
    super.resetController(controller, ...args);

    controller.createdToken = null;
  }
}
