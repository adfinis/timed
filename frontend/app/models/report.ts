import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Duration, Moment } from "moment";
import moment from "moment";
import type Task from "timed/models/task";
import type User from "timed/models/user";
/**
 * @module timed
 * @submodule timed-models
 * @public
 */

/**
 * The report model
 *
 * @class Report
 * @extends Model
 * @public
 */
export default class Report extends Model {
  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" })
  declare comment: string;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date")
  declare date?: Moment;

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  @attr("django-duration", { defaultValue: () => moment.duration() })
  declare duration: Duration;

  /**
   * The remaining effort for the underlying task
   *
   * @property {moment.duration} remainingEffort
   * @public
   */

  @attr("django-duration", { defaultValue: () => moment.duration() })
  declare remainingEffort: Duration;

  /**
   * Whether the report needs to be reviewed
   *
   * @property {Boolean} review
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare review: boolean;

  /**
   * Whether the report got rejected by the reviewer
   *
   * @property {Boolean} reject
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare rejected: boolean;

  /**
   * Whether the report is not billable
   *
   * @property {Boolean} notBillable
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare notBillable: boolean;

  /**
   * Whether the report has been marked as billed
   *
   * @property {Boolean} billed
   * @public
   */
  @attr("boolean", { defaultValue: false })
  declare billed: boolean;

  /**
   * The task
   *
   * @property {Task} task
   * @public
   */
  @belongsTo("task", { async: false, inverse: null })
  declare task: Task;

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user", { async: false, inverse: null })
  declare user: User;

  /**
   * The user which verified this report
   *
   * @property {User} verifiedBy
   * @public
   */
  @belongsTo("user", { async: true, inverse: null })
  declare verifiedBy: AsyncBelongsTo<User>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    report: Report;
  }
}
