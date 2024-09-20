import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from "@ember-data/model";
import type { Duration } from "moment";
import type Project from "timed/models/project";
import type TaskAssignee from "timed/models/task-assignee";

export default class Task extends Model {
  @attr("string", { defaultValue: "" })
  declare name: string;
  @attr("django-duration")
  declare estimatedTime?: Duration;
  @attr("django-duration")
  declare mostRecentRemainingEffort?: Duration;
  @attr("boolean", { defaultValue: false })
  declare archived: boolean;
  @attr("string", { defaultValue: "" })
  declare reference: string;

  @belongsTo("project", {
    async: true,
    inverse: "tasks",
  })
  declare project: AsyncBelongsTo<Project>;
  @hasMany("task-assignee", {
    async: true,
    inverse: "task",
  })
  declare assignees: AsyncHasMany<TaskAssignee>;

  /**
   * Flag saying that this is a task.
   * Used in /app/customer-suggestion/template.hbs
   * We're using this as a workaround for the fact that one
   * can't seem to use helpers like "(eq" in inline templates
   *
   * @property project
   * @type {Project}
   * @public
   */
  isTask = true;

  get longName() {
    const taskName = this.name;
    const projectName = this.project.get("name");
    const customerName = this.project.get("customer.name");

    return `${customerName} > ${projectName} > ${taskName}`;
  }
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    task: Task;
  }
}
