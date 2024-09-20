import type { AsyncBelongsTo } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Moment } from "moment";
import moment from "moment";
import type User from "timed/models/user";

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
   * @property {moment} date
   * @public
   */
  @attr("django-date")
  declare date?: Moment;

  /**
   * The start time
   *
   * @property {moment} from
   * @public
   */
  @attr("django-time")
  declare from?: Moment;

  /**
   * The end time
   *
   * @property {moment} to
   * @public
   */
  @attr("django-time")
  declare to?: Moment;

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  @belongsTo("user", { async: true, inverse: null })
  declare user: AsyncBelongsTo<User>;

  /**
   * The duration between start and end time
   *
   * This needs to use 00:00 of the next day if the end time is 00:00 so the
   * difference is correct.
   *
   * @property {moment.duration} duration
   * @public
   */
  get duration() {
    const calcTo =
      this.to.format("HH:mm") === "00:00"
        ? this.to.clone().add(1, "day")
        : this.to;

    return moment.duration(calcTo.diff(this.from));
  }
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    attendance: Attendance;
  }
}
