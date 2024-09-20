import type { AsyncBelongsTo } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import type Task from "timed/models/task";
import type User from "timed/models/user";

/**
 * The task assignee model
 *
 * @class TaskAssignee
 * @extends DS.Model
 * @public
 */
export default class TaskAssignee extends Model {
  /**
   * The task
   *
   * @property task
   * @type {Task}
   * @public
   */
  @belongsTo("task", { async: true, inverse: "assignees" })
  declare task: AsyncBelongsTo<Task>;
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
  interface ModelRegistry {
    "task-assignee": TaskAssignee;
  }
}
