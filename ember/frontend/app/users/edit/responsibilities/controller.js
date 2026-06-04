import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { task } from "ember-concurrency";
import { DateTime } from "luxon";

export default class UsersEditResponsibilitiesController extends Controller {
  @service router;
  @service store;

  @action
  openSupervisorProfile(superviseId) {
    return this.router.transitionTo("users.edit", superviseId);
  }

  projects = task(async () => {
    return await this.store.query("project", {
      has_reviewer: this.user?.id,
      include: "customer",
      ordering: "customer__name,name",
      archived: 0,
    });
  });

  async getBalance(supervisee) {
    return (await supervisee.absenceBalances)[0].balance;
  }

  supervisees = task(async () => {
    const supervisor = this.user?.id;

    const balances = await this.store.query("worktime-balance", {
      supervisor,
      date: DateTime.now().toISODate(),
      include: "user",
    });

    return await Promise.all(
      balances
        .map((b) => b.user)
        .filter((u) => u.get("isActive"))
        .map(async (user) => {
          const absenceBalances = await this.store.query("absence-balance", {
            date: DateTime.now().toISODate(),
            user: user.get("id"),
            absence_type: 2,
          });

          user.set("absenceBalances", absenceBalances);

          return user;
        }),
    );
  });
}
