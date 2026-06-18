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

  @tracked userId = null;
  @tracked chartRangeDays = 10;

  get worktimeBalancesFrom() {
    // Subtract (chartRangeDays - 1) so the range is inclusive of today:
    // e.g. chartRangeDays=10 → from 9 days ago through today = 10 days total
    return DateTime.now().minus({ days: this.chartRangeDays - 1 });
  }

  get worktimeBalancesTo() {
    return DateTime.now();
  }

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

  _worktimeBalancesTask = task(async () => {
    const userId = this.userId;
    const from = this.worktimeBalancesFrom;
    const to = this.worktimeBalancesTo;

    if (!userId || !from || !to) return [];

    const dates = [];
    let current = from.startOf("day");
    const end = to.startOf("day");
    while (current <= end) {
      dates.push(current);
      current = current.plus({ days: 1 });
    }

    const results = await all(
      dates.map(async (date) => {
        const balance = await this.store.query("worktime-balance", {
          user: userId,
          date: date.toISODate(),
        });
        return balance[0];
      }),
    );

    return results.filter(Boolean);
  });

  worktimeBalancesData = trackedTask(this, this._worktimeBalancesTask, () => [
    this.userId,
    this.chartRangeDays,
  ]);

  @action
  setChartRange(days) {
    this.chartRangeDays = days;
  }
}
