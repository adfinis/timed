import Route from "@ember/routing/route";

export default class UsersEditResponsitibilitesRoute extends Route {
  model() {
    return this.modelFor("users/edit");
  }
}
