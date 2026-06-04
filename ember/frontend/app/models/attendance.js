/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

/**
 * The attendance model
 *
 * @class Attendance
 * @extends DS.Model
 * @public
 */
export default class Attendance extends Model {
  /**
   * The date of the attendance
   *
   * @property {import('luxon').DateTime} date
   * @public
   */
  @attr("luxon-dt", { t: m.date }) date;

  /**
   * The start time
   *
   * @property {import('luxon').DateTime} from
   * @public
   */
  @attr("luxon-dt", { t: m.time }) from;

  /**
   * The end time
   *
   * @property {import('luxon').DateTime} to
   * @public
   */
  @attr("luxon-dt", { t: m.time }) to;

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  @belongsTo("user", { async: true, inverse: null }) user;

  /**
   * The duration between start and end time
   *
   * This needs to use 00:00 of the next day if the end time is 00:00 so the
   * difference is correct.
   *
   * @property {import('luxon').Duration} duration
   * @public
   */
  get duration() {
    const calcTo =
      this.to.toFormat("HH:mm") === "00:00"
        ? this.to.plus({ days: 1 })
        : this.to;

    return calcTo.diff(this.from);
  }
}
