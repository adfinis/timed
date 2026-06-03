/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

/**
 * The absence credit model
 *
 * @class AbsenceCredit
 * @extends DS.Model
 * @public
 */
export default class AbsenceCredit extends Model {
  /**
   * The days
   *
   * @property {number} days
   * @public
   */
  @attr("number") days;

  /**
   * The date
   *
   * @property {import('luxon').DateTime} date
   * @public
   */
  @attr("luxon-dt", { t: m.date }) date;

  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" }) comment;

  /**
   * The absence type for which this credit counts
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  @belongsTo("absence-type", { async: false, inverse: null }) absenceType;

  /**
   * The user to which this credit belongs to
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user", { async: false, inverse: null }) user;
}
