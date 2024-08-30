import { service } from "@ember/service";
import { Ability } from "ember-can";

export default class ReportAbility extends Ability {
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }

  get canEdit() {
    if (this.user?.isSuperuser) {
      return true;
    }

    if (this.model?.verifiedBy?.get("id")) {
      return false;
    }

    if (this.model?.user?.get("id") === this.user?.get("id")) {
      return true;
    }

    return false;
  }

  async isReviewer() {
    return ((await this.model?.taskAssignees) ?? [])
      .concat(
        (await this.model?.projectAssignees) ?? [],
        (await this.model?.customerAssignees) ?? []
      )
      .filter((a) => a?.user)
      .map((a) => a.user.get("id"))
      .includes(this.user?.get("id"));
  }

  async isSupervisee() {
    return ((await this.model?.user?.get("supervisors")) ?? [])
      .map((s) => s.id)
      .includes(this.user?.get("id"));
  }

  async canAedit() {
    if (this.model?.verifiedBy?.get("id")) {
      return false;
    }

    const isSupervisee = await this.isSupervisee();
    if (isSupervisee) {
      return true;
    }

    const isReviewer = await this.isReviewer();

    if (isReviewer) {
      return true;
    }

    return false;
  }
}
