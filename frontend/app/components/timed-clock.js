import { setProperties } from "@ember/object";
import { service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import { scheduleTask } from "ember-lifeline";
import moment from "moment";

const MAX_GREEN = 150;
const MAX_RED = 150;
const MAX_OVERTIME = 20;
const MIN_OVERTIME = -20;

const overtimeToColor = (overtime) => {
  if (isNaN(overtime)) {
    return "rgba(255,255,255,0)";
  }
  if (overtime < 0) {
    const opacity = Math.max(0, Math.min(1, overtime / MIN_OVERTIME));
    const redValue = Math.round(MAX_RED * opacity);
    return `rgba(${redValue},0,0,${opacity})`;
  }
  const opacity = Math.max(0, Math.min(1, overtime / MAX_OVERTIME));
  const greenValue = Math.round(MAX_GREEN * opacity);
  return `rgba(0,${greenValue},0,${opacity})`;
};

export default class TimedClock extends Component {
  @service currentUser;

  @tracked hour = 0;
  @tracked minute = 0;
  @tracked second = 0;

  _update() {
    const now = moment();

    const second = now.seconds() * 6;
    const minute = now.minutes() * 6 + second / 60;
    const hour = ((now.hours() % 12) / 12) * 360 + minute / 12;

    setProperties(this, { second, minute, hour });
  }

  constructor(...args) {
    super(...args);

    scheduleTask(this.timer, "actions", "perform");
    scheduleTask(this.worktimeTimer, "actions", "perform");
  }

  timer = task(async () => {
    while (true) {
      this._update();

      if (macroCondition(isTesting())) {
        return;
      }

      // eslint-disable-next-line no-await-in-loop
      await timeout(1000);
    }
  });

  worktimeTimer = task(async () => {
    while (true) {
      this.currentUser.worktimeBalance.perform();

      if (macroCondition(isTesting())) {
        return;
      }

      // eslint-disable-next-line no-await-in-loop
      await timeout(60000);
    }
  });

  get overtime() {
    return this.currentUser.worktimeBalance.lastSuccessful?.value;
  }

  get overtimeColor() {
    return overtimeToColor(this.overtime);
  }
}
