import { action, setProperties } from "@ember/object";
import { service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import { scheduleTask } from "ember-lifeline";
import moment from "moment";

import config from "timed/config/environment";

// local storage key
export const OVERTIME_FEEDBACK_KEY = "timed-clock-overtime-feedback";

const MAX_OVERTIME = config.APP.OVERTIME_SOFT_LIMIT;
const MIN_OVERTIME = config.APP.OVERTIME_SOFT_LIMIT * -1;

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
    //TODO: fix this feature
    // scheduleTask(this.worktimeTimer, "actions", "perform");
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
      if (this._overtimeFeedback) {
        this.currentUser.worktimeBalance.perform();
      }

      if (macroCondition(isTesting())) {
        return;
      }

      // eslint-disable-next-line no-await-in-loop
      await timeout(120000);
    }
  });

  get overtime() {
    return this.currentUser.worktimeBalance.lastSuccessful?.value;
  }

  get overtimeOpacity() {
    return overtimeToOpacity(this.overtime);
  }

  get overtimeFeedback() {
    return false;
    // TODO: fix this feature -> don't refresh to often and improve backend query
    // return (
    //   this._overtimeFeedback ??
    //   JSON.parse(localStorage.getItem(OVERTIME_FEEDBACK_KEY))
    // );
  }

  set overtimeFeedback(value) {
    this._overtimeFeedback = value;
    localStorage.setItem(OVERTIME_FEEDBACK_KEY, value);
  }

  @action
  toggleOvertimeFeedback() {
    return;
    // TODO: fix this feature
    // this.overtimeFeedback = !this.overtimeFeedback;
    // this.notify.info(
    //   `${this.overtimeFeedback ? "Enabled" : "Disabled"} visual overtime feedback`,
    // );
  }
}
