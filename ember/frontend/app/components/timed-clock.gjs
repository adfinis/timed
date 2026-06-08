import { concat } from "@ember/helper";
import { on } from "@ember/modifier";
import { action, setProperties } from "@ember/object";
import { service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import { scheduleTask } from "ember-lifeline";
import style_ from "ember-style-modifier/modifiers/style";
import gte from "ember-truth-helpers/helpers/gte";
import or from "ember-truth-helpers/helpers/or";
import { DateTime } from "luxon";

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
    const now = DateTime.now();

    const second = now.second * 6;
    const minute = now.minute * 6 + second / 60;
    const hour = ((now.hour % 12) / 12) * 360 + minute / 12;

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
  <template>
    <a href="#" {{on "click" this.toggleOvertimeFeedback}}>
      <svg
        class="timed-clock h-[var(--clock-size)] w-[--clock-size] stroke-[--clock]"
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        {{style_ --clock-size=(concat (or @clockSize 50) "px")}}
        ...attributes
        data-test-timed-clock
      >
        <defs>
          <radialGradient id="clockGradient" r="50%">
            <stop offset="0%" stop-color="var(--background-muted)" />
            {{#if this.overtimeFeedback}}
              <stop
                offset="60%"
                stop-color="var(--background-muted)"
                stop-opacity="0%"
              />
              <stop
                offset="100%"
                stop-color="var(--{{if
                  (gte this.overtime 0)
                  'success'
                  'danger'
                }})"
                stop-opacity={{this.overtimeOpacity}}
              />
            {{/if}}
          </radialGradient>
        </defs>
        {{#if this.overtimeFeedback}}
          <title>Your overtime: {{this.overtime}}h</title>
        {{/if}}
        <circle
          class="circle"
          r="240"
          cx="256"
          cy="256"
          stroke-width="20"
          fill={{if this.overtimeFeedback "url(#clockGradient)" "transparent"}}
        />
        <line
          class="hour"
          x1="256"
          y1="144"
          x2="256"
          y2="288"
          stroke-width="30"
          stroke-linecap="round"
          transform="rotate({{this.hour}} 256 256)"
        />
        <line
          class="minute"
          x1="256"
          y1="80"
          x2="256"
          y2="288"
          stroke-width="20"
          stroke-linecap="round"
          transform="rotate({{this.minute}} 256 256)"
        />
        <line
          class="second stroke-[--clock-accent]"
          x1="256"
          y1="64"
          x2="256"
          y2="288"
          stroke-width="20"
          stroke-linecap="round"
          transform="rotate({{this.second}} 256 256)"
        />
      </svg>
    </a>
  </template>
}
