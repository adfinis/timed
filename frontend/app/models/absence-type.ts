import type { AsyncHasMany } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, hasMany } from "@ember-data/model";
import type AbsenceBalance from "timed/models/absence-balance";

/**
 * The absence type model
 *
 * @class AbsenceType
 * @extends DS.Model
 * @public
 */
export default class AbsenceType extends Model {
  /**
   * The name of the absence type
   *
   * E.g Military, Holiday or Sickness
   *
   * @property {String} name
   * @public
   */
  @attr("string")
  declare name?: string;

  /**
   * Whether the absence type only fills the worktime
   *
   * @property {Boolean} fillWorktime
   * @public
   */
  @attr("boolean")
  declare fillWorktime?: boolean;

  /**
   * The balances for this type
   *
   * @property {AbsenceBalance[]} absenceBalances
   * @public
   */
  @hasMany("absence-balance", { async: true, inverse: "absenceType" })
  declare absenceBalances: AsyncHasMany<AbsenceBalance>;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "absence-type": AbsenceType;
  }
}
