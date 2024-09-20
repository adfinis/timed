import Model, { attr } from "@ember-data/model";
import type { Duration } from "moment";

export default class YearStatistic extends Model {
  @attr("number")
  declare year?: number;
  @attr("django-duration")
  declare duration?: Duration;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "year-statistic": YearStatistic;
  }
}
