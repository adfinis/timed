import type { AsyncBelongsTo } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Moment } from "moment";
import type Location from "timed/models/location";

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
  @attr("string")
  declare name?: string;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date")
  declare date?: Moment;

  /**
   * The location
   *
   * @property {Location} location
   * @public
   */
  @belongsTo("location", { async: true, inverse: null })
  declare location: AsyncBelongsTo<Location>;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "public-holiday": PublicHoliday;
  }
}
