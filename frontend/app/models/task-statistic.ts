import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Duration } from "moment";
import type Project from "timed/models/project";

export default class TaskStatistics extends Model {
  @attr
  declare name?: string;
  @attr("django-duration")
  declare duration?: Duration;
  @attr("django-duration")
  declare estimatedTime?: Duration;
  @attr("django-duration")
  declare mostRecentRemainingEffort?: Duration;
  @belongsTo("project", { async: true, inverse: null })
  declare project: AsyncBelongsTo<Project>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "task-statistic": TaskStatistics;
  }
}
