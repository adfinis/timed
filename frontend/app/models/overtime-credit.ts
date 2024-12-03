import Model, { attr, belongsTo } from "@ember-data/model";
import type { Moment, Duration } from "moment";
import type User from "timed/models/user";

export default class OvertimeCredit extends Model {
  @attr("django-date")
  declare date?: Moment;
  @attr("django-duration")
  declare duration?: Duration;
  @attr("string", { defaultValue: "" })
  declare comment: string;
  @belongsTo("user", { async: false, inverse: null })
  declare user: User;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "overtime-credit": OvertimeCredit;
  }
}
