import { service } from "@ember/service";
import { Ability } from "ember-can";

export default class OvertimeCreditAbility extends Ability {
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }
  get canEdit() {
    return this.user.isSuperuser;
  }
  get canCreate() {
    return this.user.isSuperuser;
  }
}
