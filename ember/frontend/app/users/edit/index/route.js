import Route from "@ember/routing/route";

export default class UsersEditsIndexRoute extends Route {
  model() {
    return this.modelFor("users/edit");
  }
}
