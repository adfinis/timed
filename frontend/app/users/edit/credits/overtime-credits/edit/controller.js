import Controller, { inject as controller } from "@ember/controller";
import { service } from "@ember/service";
import { task, dropTask } from "ember-concurrency";
import OvertimeCreditValidations from "timed/validations/overtime-credit";

export default class UsersEditOvertimeCreditsController extends Controller {
  @service notify;
  @service router;
  @service store;
  @controller("users.edit") userController;
  @controller("users.edit.credits.index") userCreditsController;

  OvertimeCreditValidations = OvertimeCreditValidations;

  credit = task(async () => {
    const id = this.model;

    return id
      ? await this.store.findRecord("overtime-credit", id)
      : await this.store.createRecord("overtime-credit", {
          user: this.user,
        });
  });

  save = dropTask(async (changeset) => {
    try {
      await changeset.save();

      this.notify.success("Overtime credit was saved");

      this.userController.data.perform(this.user.id);

      let allYears = this.userCreditsController.years.lastSuccessful?.value;

      if (!allYears) {
        allYears = await this.userCreditsController.years.perform(this.user.id);
      }

      const year =
        allYears.find((y) => y === String(changeset.get("date").year())) || "";

      await this.router.transitionTo("users.edit.credits", this.user.id, {
        queryParams: { year },
      });
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the overtime credit");
    }
  });

  delete = dropTask(async (credit) => {
    try {
      await credit.destroyRecord();

      this.notify.success("Overtime credit was deleted");

      this.userController.data.perform(this.user.id);

      this.router.transitionTo("users.edit.credits");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the overtime credit");
    }
  });
}
