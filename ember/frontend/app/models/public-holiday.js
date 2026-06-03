/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

/**
 * The public holiday model
 *
 * @class PublicHoliday
 * @extends DS.Model
 * @public
 */
export default class PublicHoliday extends Model {
  /**
   * The name
   *
   * @property {String} name
   * @public
   */
  @attr("string") name;

  /**
   * The date
   *
   * @property {import('luxon').DateTime} date
   * @public
   */
  @attr("luxon-dt", { t: m.date }) date;

  /**
   * The location
   *
   * @property {import('timed/models/location')} location
   * @public
   */
  @belongsTo("location", { async: true, inverse: null }) location;
}
