import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Duration } from "moment";
import type Customer from "timed/models/customer";

export default class ProjectStatistics extends Model {
  @attr
  declare name?: string;
  @attr("django-duration")
  declare estimatedTime?: Duration;
  @attr("django-duration")
  declare duration?: Duration;
  @attr("django-duration")
  declare totalRemainingEffort?: Duration;
  @belongsTo("customer", { async: true, inverse: null })
  declare customer: AsyncBelongsTo<Customer>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "project-statistic": ProjectStatistics;
  }
}
