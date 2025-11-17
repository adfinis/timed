import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class ProtectedRoute extends Route {
  @service session;
  @service account;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, "login");
  }

  async model() {
    await this.account.fetchCurrentUser();

    return this.account.user;
  }
}
