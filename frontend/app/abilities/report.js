import { service } from "@ember/service";
import { Ability } from "ember-can";

export default class ReportAbility extends Ability {
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }

  get canEdit() {
    const isEditable =
      this.user?.isSuperuser ||
      (!this.model?.verifiedBy?.get("id") &&
        // eslint-disable-next-line ember/no-get
        (this.model?.user?.get("id") === this.user?.get("id") ||
          // eslint-disable-next-line ember/no-get
          (this.model?.user?.get("supervisors") ?? [])
            .map((s) => s.id)
            .includes(this.user?.get("id"))));
    const isReviewer =
      (this.model?.taskAssignees ?? [])
        .concat(
          this.model?.projectAssignees ?? [],
          this.model?.customerAssignees ?? [],
        )
        .filter((a) => a?.user)
        .map((a) => a.user.get("id"))
        .includes(this.user?.get("id")) && !this.model?.verifiedBy?.get("id");
    return isEditable || isReviewer;
  }
}
