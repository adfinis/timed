import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Duration } from "moment";
import type User from "timed/models/user";

export default class UserStatistic extends Model {
  @attr("django-duration")
  declare duration?: Duration;

  @belongsTo("user", { async: true, inverse: null })
  declare user: AsyncBelongsTo<User>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "user-statistic": UserStatistic;
  }
}
