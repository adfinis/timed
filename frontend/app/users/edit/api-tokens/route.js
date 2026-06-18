import Route from "@ember/routing/route";
import { service } from "@ember/service";

export default class UsersEditApiTokensRoute extends Route {
  @service currentUser;
  @service router;

  beforeModel() {
    // API tokens can only be managed by their owner
    const user = this.modelFor("users.edit");

    if (user.id !== this.currentUser.user?.id) {
      this.router.replaceWith("users.edit.index", user.id);
    }
  }
}
