import { setProperties } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task, timeout } from "ember-concurrency";
import moment from "moment";

export default class TimedClock extends Component {
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

    scheduleOnce("actions", this.timer, "perform");
  }

  timer = task(async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this._update();

      if (macroCondition(isTesting())) {
        return;
      }

      // eslint-disable-next-line no-await-in-loop
      await timeout(1000);
    }
  });
}
