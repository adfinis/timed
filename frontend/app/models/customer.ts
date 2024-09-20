import type { AsyncHasMany } from "@ember-data/model";
import Model, { attr, hasMany } from "@ember-data/model";
import type CustomerAssignee from "timed/models/customer-assignee";
import type Project from "timed/models/project";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */

/**
 * The customer model
 *
 * @class Customer
 * @extends DS.Model
 * @public
 */
export default class Customer extends Model {
  /**
   * The name
   *
   * @property name
   * @type {String}
   * @public
   */
  @attr("string", { defaultValue: "" })
  declare name: string;

  /**
   * Whether the project is archived
   *
   * @property archived
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare archived: boolean;

  /**
   * The projects
   *
   * @property projects
   * @type {Project[]}
   * @public
   */
  @hasMany("project", { async: true, inverse: "customer" })
  declare projects: AsyncHasMany<Project>;

  /**
   * Long name - alias for name, used for filtering in the customer box
   *
   * @property {String} longName
   * @public
   */
  get longName() {
    return this.name;
  }

  /**
   * Assigned users to this customer
   *
   * @property assignees
   * @type {CustomerAssignee[]}
   * @public
   */
  @hasMany("customer-assignee", { async: true, inverse: null })
  declare assignees: AsyncHasMany<CustomerAssignee>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    customer: Customer;
  }
}
