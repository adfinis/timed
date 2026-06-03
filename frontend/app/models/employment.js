/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

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
  @attr("number") percentage;

  /**
   * The time the user has to work every day
   *
   * @property {import('luxon').Duration} worktimePerDay
   * @public
   */
  @attr("django-duration") worktimePerDay;

  /**
   * The start date
   *
   * @property {import('luxon').DateTime} start
   * @public
   */
  @attr("luxon-dt", { t: m.date }) start;

  /**
   * The end date
   *
   * @property {import('luxon').DateTime} end
   * @public
   */
  @attr("luxon-dt", { t: m.date }) end;

  /**
   * Whether the employment is of an external employee
   *
   * @property {boolean} isExternal
   * @public
   */
  @attr("boolean", { defaultValue: false }) isExternal;

  /**
   * The employed user
   *
   * @property {import('timed/models/user')} user
   * @public
   */
  @belongsTo("user", { async: true, inverse: "employments" }) user;

  /**
   * The work location
   *
   * @property {import('timed/models/location')} location
   * @public
   */
  @belongsTo("location", { async: true, inverse: null }) location;
}
