import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { task, all, hash } from "ember-concurrency";
import { DateTime } from "luxon";
import { trackedTask } from "reactiveweb/ember-concurrency";

export const CHART_RANGES = [
  { days: 10, label: "10D" },
  { days: 30, label: "1M" },
  { days: 90, label: "3M" },
];

export default class UsersEditController extends Controller {
  @service store;

  @tracked chartRangeDays = 10;

  chartRanges = CHART_RANGES;

  data = task(async (uid) => {
    return await hash({
      worktimeBalanceLastValidTimesheet:
        this.worktimeBalanceLastValidTimesheet.perform(uid),
      worktimeBalanceToday: this.worktimeBalanceToday.perform(uid),
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
      date: DateTime.now().toISODate(),
    });

    return worktimeBalance[0];
  });

  absenceBalances = task(async (user) => {
    return await this.store.query("absence-balance", {
      user,
      date: DateTime.now().toISODate(),
      include: "absence_type",
    });
  });

  _worktimeBalancesTask = task(async (userId, chartRangeDays) => {
    if (!userId) return [];

    const dates = [...Array(chartRangeDays).keys()]
      .map((i) => DateTime.now().minus({ days: i }))
      .reverse();

    return await all(
      dates.map(async (date) => {
        const balance = await this.store.query("worktime-balance", {
          user: userId,
          date: date.toISODate(),
        });
        return balance[0];
      }),
    );
  });

  worktimeBalancesData = trackedTask(this, this._worktimeBalancesTask, () => [
    this.model?.id,
    this.chartRangeDays,
  ]);

  @action
  setChartRange(days) {
    this.chartRangeDays = days;
  }
}
