import type { AsyncHasMany } from "@ember-data/model";
import Model, { attr, belongsTo, hasMany } from "@ember-data/model";
import type { Duration } from "moment";
import type AbsenceCredit from "timed/models/absence-credit";
import type AbsenceType from "timed/models/absence-type";
import type User from "timed/models/user";

export default class AbsenceBalance extends Model {
  @attr("number")
  declare credit?: number;
  @attr("number")
  declare usedDays?: number;
  @attr("django-duration")
  declare usedDuration?: Duration;
  @attr("number")
  declare balance?: number;
  @belongsTo("user", { async: false, inverse: "absenceBalances" })
  declare user: User;
  @belongsTo("absence-type", { async: false, inverse: "absenceBalances" })
  declare absenceType: AbsenceType;
  @hasMany("absence-credit", { async: true, inverse: null })
  declare absenceCredits: AsyncHasMany<AbsenceCredit>;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "absence-balance": AbsenceBalance;
  }
}
