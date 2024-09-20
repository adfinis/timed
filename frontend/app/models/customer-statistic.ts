import Model, { attr } from "@ember-data/model";
import type { Duration } from "moment";

export default class CustomerStatistics extends Model {
  @attr("django-duration")
  declare duration?: Duration;
  @attr
  declare name?: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "customer-statistic": CustomerStatistics;
  }
}
