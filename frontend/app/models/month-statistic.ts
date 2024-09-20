import Model, { attr } from "@ember-data/model";
import type { Duration } from "moment";

export default class MonthStatistic extends Model {
  @attr("number")
  declare year?: number;
  @attr("number")
  declare month?: number;
  @attr("django-duration")
  declare duration?: Duration;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "month-statistic": MonthStatistic;
  }
}
