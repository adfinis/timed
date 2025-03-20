import Controller, { inject as controller } from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { dropTask, restartableTask } from "ember-concurrency";
import moment from "moment";

export default class UsersEditCredits extends Controller {
  queryParams = ["year"];

  @tracked year = moment().year().toString();

  @service notify;
  @service fetch;
  @service abilities;
  @service router;
  @service store;

  @controller("users.edit") userController;

  @action
  fetchData(year) {
    this.year = year;
    this.years.perform();
    this.absenceCredits.perform();
    this.overtimeCredits.perform();
  }

  years = restartableTask(async (userId = 0) => {
    const employments = await this.store.query("employment", {
      user: userId === 0 ? this.model.id : userId,
      ordering: "start_date",
    });

    const from = (employments[0].get("start") || moment()).year();
    const to = moment().add(1, "year").year();

    return [...new Array(to + 1 - from).keys()].map((i) => `${from + i}`);
  });

  get allowTransfer() {
    return (
      parseInt(this.year) === moment().year() - 1 &&
      this.abilities.can("create overtime-credit") &&
      this.abilities.can("create absence-credit")
    );
  }

  absenceCredits = restartableTask(async () => {
    const year = this.year;

    return await this.store.query("absence-credit", {
      user: this.model.id,
      include: "absence_type",
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  });

  overtimeCredits = restartableTask(async () => {
    const year = this.year;

    return await this.store.query("overtime-credit", {
      user: this.model.id,
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  });

  transfer = dropTask(async () => {
    /* istanbul ignore next */
    if (!this.allowTransfer) {
      return;
    }

    try {
      await this.fetch.fetch(`/api/v1/users/${this.model.id}/transfer`, {
        method: "POST",
      });

      this.notify.success("Transfer was successful");

      this.userController.data.perform(this.model.id);

      this.fetchData(moment().year().toString());
    } catch {
      this.notify.error("Error while transfering");
    }
  });

  editAbsenceCredit = dropTask(async (id) => {
    if (this.abilities.can("edit absence-credit")) {
      await this.router.transitionTo(
        "users.edit.credits.absence-credits.edit",
        id,
      );
    }
  });

  editOvertimeCredit = dropTask(async (id) => {
    if (this.abilities.can("edit overtime-credit")) {
      await this.router.transitionTo(
        "users.edit.credits.overtime-credits.edit",
        id,
      );
    }
  });
}
