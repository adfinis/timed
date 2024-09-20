import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Duration, Moment } from "moment";
import moment from "moment";
import type AbsenceType from "timed/models/absence-type";
import type User from "timed/models/user";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */

/**
 * The report model
 *
 * @class Report
 * @extends DS.Model
 * @public
 */
export default class Absence extends Model {
  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" })
  declare comment: string;

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  @attr("django-duration", { defaultValue: () => moment.duration() })
  declare duration: Duration;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date")
  declare date?: Moment;

  /**
   * The type of the absence
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  @belongsTo("absence-type", { async: false, inverse: null })
  declare absenceType: AbsenceType;

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user", { async: true, inverse: null })
  declare user: AsyncBelongsTo<User>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    absence: Absence;
  }
}
