import Controller from "@ember/controller";
import { service } from "@ember/service";
import { task, all, hash } from "ember-concurrency";
import { DateTime } from "luxon";

export default class UsersEditController extends Controller {
  @service store;

  data = task(async (uid) => {
    return await hash({
      worktimeBalanceLastValidTimesheet:
        this.worktimeBalanceLastValidTimesheet.perform(uid),
      worktimeBalanceToday: this.worktimeBalanceToday.perform(uid),
      worktimeBalances: this.worktimeBalances.perform(uid),
      absenceBalances: this.absenceBalances.perform(uid, DateTime.now()),
      absenceBalancesEndOfYear: this.absenceBalances.perform(
        uid,
        DateTime.now().endOf("year"),
      ),
    });
  });

  worktimeBalanceLastValidTimesheet = task(async (user) => {
    const worktimeBalance = await this.store.query("worktime-balance", {
      user,
      last_reported_date: 1,
    });

    return worktimeBalance[0];
  });

  worktimeBalanceToday = task(async (user) => {
    const worktimeBalance = await this.store.query("worktime-balance", {
      user,
      date: DateTime.now().toISODate(),
    });

    return worktimeBalance[0];
  });

  absenceBalances = task(async (user, date) => {
    return await this.store.query("absence-balance", {
      user,
      date: date.toISODate(),
      include: "absence_type",
    });
  });

  worktimeBalances = task(async (user) => {
    const dates = [...Array(10).keys()]
      .map((i) => DateTime.now().minus({ days: i }))
      .reverse();

    return await all(
      dates.map(async (date) => {
        const balance = await this.store.query("worktime-balance", {
          user,
          date: date.toISODate(),
        });

        return balance[0];
      }),
    );
  });
}
