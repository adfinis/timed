import type { AsyncBelongsTo } from "@ember-data/model";
import Model, { attr, belongsTo } from "@ember-data/model";
import type { Moment, Duration } from "moment";
import type User from "timed/models/user";

export default class WorktimeBalance extends Model {
  @attr("django-date")
  declare date?: Moment;
  @attr("django-duration")
  declare balance?: Duration;
  @belongsTo("user", { async: true, inverse: "worktimeBalances" })
  declare user: AsyncBelongsTo<User>;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "worktime-balance": WorktimeBalance;
  }
}
