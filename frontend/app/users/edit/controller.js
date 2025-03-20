import Controller from "@ember/controller";
import { service } from "@ember/service";
import { task, all, hash } from "ember-concurrency";
import moment from "moment";

export default class UsersEditController extends Controller {
  @service store;

  data = task(async (uid) => {
    return await hash({
      worktimeBalanceLastValidTimesheet:
        this.worktimeBalanceLastValidTimesheet.perform(uid),
      worktimeBalanceToday: this.worktimeBalanceToday.perform(uid),
      worktimeBalances: this.worktimeBalances.perform(uid),
      absenceBalances: this.absenceBalances.perform(uid),
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
      date: moment().format("YYYY-MM-DD"),
    });

    return worktimeBalance[0];
  });

  absenceBalances = task(async (user) => {
    return await this.store.query("absence-balance", {
      user,
      date: moment().format("YYYY-MM-DD"),
      include: "absence_type",
    });
  });

  worktimeBalances = task(async (user) => {
    const dates = [...Array(10).keys()]
      .map((i) => moment().subtract(i, "days"))
      .reverse();

    return await all(
      dates.map(async (date) => {
        const balance = await this.store.query("worktime-balance", {
          user,
          date: date.format("YYYY-MM-DD"),
        });

        return balance[0];
      }),
    );
  });
}
