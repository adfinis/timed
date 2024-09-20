/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr } from "@ember-data/model";

/**
 * The location model
 *
 * @class Location
 * @extends DS.Model
 * @public
 */
export default class Location extends Model {
  /**
   * The name
   *
   * @property {String} name
   * @public
   */
  @attr("string")
  declare name?: string;

  /**
   * The days on which users in this location need to work
   *
   * @property {Number[]} workdays
   * @public
   */
  @attr("django-workdays")
  declare workdays?: number[];
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    location: Location;
  }
}
