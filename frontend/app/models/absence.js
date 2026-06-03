/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import { Duration } from "luxon";

import { MODES as m } from "timed/transforms/luxon-dt";

/**
 * The absence model
 *
 * @class Report
 * @extends DS.Model
 * @public
 */
export default class Absence extends Model {
  /**
   * The comment
   *
   * @property {string} comment
   * @public
   */
  @attr("string", { defaultValue: "" }) comment;

  /**
   * The duration
   *
   * @property {Duration} duration
   * @public
   */
  @attr("django-duration", { defaultValue: () => Duration.fromMillis(0) })
  duration;

  /**
   * The date
   *
   * @property {import('luxon').DateTime} date
   * @public
   */
  @attr("luxon-dt", { t: m.date }) date;

  /**
   * The type of the absence
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  @belongsTo("absence-type", { async: false, inverse: null }) absenceType;

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user", { async: true, inverse: null }) user;
}
