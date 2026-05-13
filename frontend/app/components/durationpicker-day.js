import { action } from "@ember/object";
import { debounceTask } from "ember-lifeline";
import moment from "moment";

import DurationpickerComponent from "timed/components/durationpicker";
import parseDayTime from "timed/utils/parse-daytime";

export default class DurationpickerDayComponent extends DurationpickerComponent {
  maxlength = 5;

  max = moment.duration({ h: 24, m: 0 });

  min = moment.duration({ h: 0, m: 0 });

  sanitize(value) {
    return value.replace(/[^\d:]/, "");
  }

  get pattern() {
    return "^(?:[01]?\\d|2[0-3])?:?(?:00|15|30|45)?$";
  }

  @action
  change({ target: { validity, value } }) {
    if (validity.valid) {
      const [h, m] = parseDayTime(value);
      this._change(this._set(h, m));
    }
  }

  @action
  wheelAction(event) {
    event.preventDefault();
    debounceTask(this, "_wheel", event.deltaY, 100);
  }

  _wheel(deltaY) {
    const direction = deltaY > 0 ? -1 : 1;
    this._addMinutes(this.precision * direction);
  }
}
