import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Moment, Duration } from "moment";
import type Location from "timed/models/location";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import type User from "timed/models/user";

/**
 * The employment model
 *
 * @class Employment
 * @extends DS.Model
 * @public
 */
export default class Employment extends Model {
  /**
   * The percentage
   *
   * @property {Number} percentage
   * @public
   */
  @attr("number")
  declare percentage?: number;

  /**
   * The time the user has to work every day
   *
   * @property {moment.duration} worktimePerDay
   * @public
   */
  @attr("django-duration")
  declare worktimePerDay?: Duration;

  /**
   * The start date
   *
   * @property {moment} start
   * @public
   */
  @attr("django-date")
  declare start?: Moment;

  /**
   * Whether the employment is of an external employee
   *
   * @property {Boolean} isExternal
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare isExternal: boolean;

  /**
   * The end date
   *
   * @property {moment} end
   * @public
   */
  @attr("django-date")
  declare end?: Moment;

  /**
   * The employed user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user", { async: true, inverse: "employments" })
  declare user: AsyncBelongsTo<User>;

  /**
   * The work location
   *
   * @property {Location} location
   * @public
   */
  @belongsTo("location", { async: true, inverse: null })
  declare location: AsyncBelongsTo<Location>;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    employment: Employment;
  }
}
