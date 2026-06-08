/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { htmlSafe } from "@ember/template";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency";
import perform from "ember-concurrency/helpers/perform";
import { DateTime } from "luxon";

import RangeSlider from "timed/components/range-slider";
import formatDuration from "timed/utils/format-duration";
import { pad2joincolon } from "timed/utils/pad";

/**
 * The formatter for the slider tooltips
 *
 * @constant
 * @type {Object}
 * @public
 */
const Formatter = {
  /**
   * Format the minutes to a time string
   *
   * @method to
   * @param {Number} value The time in minutes
   * @return {String} The formatted time
   * @public
   */
  to(value) {
    return DateTime.fromObject({ hour: 0 })
      .plus({ minutes: value })
      .toFormat("HH:mm");
  },
};

/**
 * The attendance slider component
 *
 * @class AttendanceSliderComponent
 * @public
 */
export default class AttendanceSlider extends Component {
  /**
   * The attendance
   *
   * @property {Attendance} attendance
   * @public
   */
  @tracked values;
  @tracked tooltips;

  /**
   * Initialize the component
   *
   * @method init
   * @public
   */
  constructor(...args) {
    super(...args);

    this.tooltips = [Formatter, Formatter];
    this.values = this.start;
  }

  /**
   * The start and end time in minutes
   *
   * @property {Number[]} start
   * @public
   */
  get start() {
    const { to, from } = this.args.attendance;

    return [
      from.hour * 60 + from.minute,
      // If the end time is 00:00 we need to clarify that this would be 00:00
      // of the next day
      to.hour * 60 + to.minute || 24 * 60,
    ];
  }

  /**
   * The duration of the attendance as a string
   *
   * @property {String} duration
   * @public
   */
  get duration() {
    const empty = DateTime.fromObject({ hour: 0 });

    const from = empty.set({ minute: this.values[0] });
    const to = empty.set({ minute: this.values[1] });
    return formatDuration(to.diff(from, ["hours", "minutes"]), false);
  }

  /**
   * The labels for the slider
   *
   * @property {string[]} labels
   * @public
   */
  get labels() {
    const labels = [];

    for (let h = 0; h <= 24; h++) {
      for (let m = 0; m <= 30 && !(h === 24 && m === 30); m += 30) {
        const offsetH = (100 / 24) * h;
        const offsetM = (100 / 24 / 60) * m;

        labels.push({
          value: pad2joincolon(h, m),
          size: m === 0 ? "text-4xs" : "text-3xs",
          style: htmlSafe(`left: ${offsetH + offsetM}%;`),
        });
      }
    }

    return labels;
  }

  /**
   * Save the attendance
   *
   * @method save
   * @param {Number[]} values The time in minutes
   * @public
   */
  save = dropTask(async ([fromMin, toMin]) => {
    const attendance = this.args.attendance;

    attendance.from = attendance.from.startOf("day").plus({ minutes: fromMin });
    attendance.to = attendance.to.startOf("day").plus({ minutes: toMin });

    await this.args.onSave(attendance);
  });

  /**
   * Delete the attendance
   *
   * @method delete
   * @public
   */
  delete = dropTask(async () => {
    await this.args.onDelete(this.args.attendance);
  });
  <template>
    <div class="attendance-slider relative pt-4" ...attributes>
      <RangeSlider
        @start={{this.start}}
        @step={{15}}
        @min={{0}}
        @max={{1440}}
        @connect={{true}}
        @animate={{true}}
        @behaviour="drag"
        @tooltips={{this.tooltips}}
        @on-slide={{fn (mut this.values)}}
        @on-change={{perform this.save}}
      />

      <div class="slider-labels text-foreground-muted relative h-12 font-mono">
        {{#each this.labels as |label|}}
          <div
            style={{label.style}}
            class="slider-label absolute top-4 flex -translate-x-3/4"
          >
            <div class="slider-label-text -rotate-45 {{label.size}}">
              {{label.value}}
            </div>
          </div>
        {{/each}}
      </div>

      <div class="slider-title absolute left-0 top-0 text-xs">
        <span>{{this.duration}}</span>
        <FaIcon
          @icon="trash-can"
          data-test-delete-attendance="true"
          {{on "click" (perform this.delete)}}
        />
      </div>
    </div>
  </template>
}
