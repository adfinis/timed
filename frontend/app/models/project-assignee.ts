import type { AsyncBelongsTo } from "@ember-data/model";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import type Project from "timed/models/project";
import type User from "timed/models/user";

/**
 * The project assignee model
 *
 * @class ProjectAssignee
 * @extends DS.Model
 * @public
 */
export default class ProjectAssignee extends Model {
  /**
   * The project
   *
   * @property project
   * @type {Project}
   * @public
   */
  @belongsTo("project", { async: true, inverse: null })
  declare project: AsyncBelongsTo<Project>;

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
    "project-assignee": ProjectAssignee;
  }
}
