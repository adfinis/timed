import type { AsyncHasMany, AsyncBelongsTo } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import type { Duration } from "moment";
import type BillingType from "timed/models/billing-type";
import type Customer from "timed/models/customer";
import type ProjectAssignee from "timed/models/project-assignee";
import type Task from "timed/models/task";

/**
 * The project model
 *
 * @class Project
 * @extends DS.Model
 * @public
 */
export default class Project extends Model {
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
   * The estimated time for this project
   *
   * @property {moment.duration} estimatedTime
   * @public
   */
  @attr("django-duration")
  declare estimatedTime?: Duration;

  /**
   * Boolean indicating if the remainig effort should be trackable
   * for this project.
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare remainingEffortTracking: boolean;

  /**
   * Total remainig effort for this project
   * @property {moment.duration} estimatedtime
   * @public
   */
  @attr("django-duration")
  declare totalRemainingEffort?: Duration;

  /**
   * The customer
   *
   * @property customer
   * @type {Customer}
   * @public
   */
  @belongsTo("customer", { async: true, inverse: "projects" })
  declare customer: AsyncBelongsTo<Customer>;

  /**
   * Whether the project's comments are visible to the customer
   *
   * @property customerVisible
   * @type {Boolean}
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare customerVisible: boolean;

  /**
   * The billing
   *
   * @property {BillingType} billingType
   * @public
   */
  @belongsTo("billing-type", { async: false, inverse: null })
  declare billingType: BillingType;

  /**
   * The tasks
   *
   * @property tasks
   * @type {Task[]}
   * @public
   */
  @hasMany("task", { async: true, inverse: "project" })
  declare tasks: AsyncHasMany<Task>;

  /**
   * Assigned users to this project
   *
   * @property assignees
   * @type {ProjectAssignee[]}
   * @public
   */
  @hasMany("project-assignee", { async: true, inverse: null })
  declare assignees: AsyncHasMany<ProjectAssignee>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    project: Project;
  }
}
