import type { AsyncBelongsTo } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import type Customer from "timed/models/customer";
import type User from "timed/models/user";

/**
 * The customer assignee model
 *
 * @class CustomerAssignee
 * @extends DS.Model
 * @public
 */
export default class CustomerAssignee extends Model {
  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  @belongsTo("customer", { async: true, inverse: null })
  declare customer: AsyncBelongsTo<Customer>;
  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  @belongsTo("user", { async: true, inverse: null })
  declare user: AsyncBelongsTo<User>;

  /**
   * Whether the assignee is a reviewer
   *
   * @property isReviewer
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare isReviewer: boolean;

  /**
   * Whether the assignee is a manager
   *
   * @property isManager
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare isManager: boolean;

  /**
   * Whether the assignee is a resource
   *
   * @property isResource
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare isResource: boolean;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "customer-assignee": CustomerAssignee;
  }
}
