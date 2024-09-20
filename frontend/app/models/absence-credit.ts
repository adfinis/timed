import Model, { attr, belongsTo } from "@ember-data/model";
import type { Moment } from "moment";
import type AbsenceType from "timed/models/absence-type";
import type User from "timed/models/user";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */

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
   * @property {Number} days
   * @public
   */
  @attr("number")
  declare days?: number;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date")
  declare date?: Moment;

  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" })
  declare comment: string;

  /**
   * The absence type for which this credit counts
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  @belongsTo("absence-type", { async: false, inverse: null })
  declare absenceType: AbsenceType;

  /**
   * The user to which this credit belongs to
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user", { async: false, inverse: null })
  declare user: User;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "absence-credit": AbsenceCredit;
  }
}
