import { action, setProperties } from "@ember/object";
import { service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import { scheduleTask } from "ember-lifeline";
import moment from "moment";

// local storage key
export const OVERTIME_FEEDBACK_KEY = "timed-clock-overtime-feedback";

const MAX_OVERTIME = 20;
const MIN_OVERTIME = -20;

const overtimeToOpacity = (overtime) => {
  if (isNaN(overtime)) {
    return 0;
  }
  if (overtime < 0) {
    const opacity = Math.max(0, Math.min(1, overtime / MIN_OVERTIME));
    return opacity;
  }
  const opacity = Math.max(0, Math.min(1, overtime / MAX_OVERTIME));
  return opacity;
};

export default class TimedClock extends Component {
  @service currentUser;
  @service appearance;
  @service notify;

  @tracked hour = 0;
  @tracked minute = 0;
  @tracked second = 0;
  @tracked _overtimeFeedback;

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

  get overtimeOpacity() {
    return overtimeToOpacity(this.overtime);
  }

  get overtimeFeedback() {
    return (
      this._overtimeFeedback ??
      JSON.parse(localStorage.getItem(OVERTIME_FEEDBACK_KEY))
    );
  }

  set overtimeFeedback(value) {
    this._overtimeFeedback = value;
    localStorage.setItem(OVERTIME_FEEDBACK_KEY, value);
  }

  @action
  toggleOvertimeFeedback() {
    this.overtimeFeedback = !this.overtimeFeedback;
    this.notify.info(
      `${this.overtimeFeedback ? "Enabled" : "Disabled"} visual overtime feedback`,
    );
  }
}
