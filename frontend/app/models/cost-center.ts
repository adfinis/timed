import Model, { attr } from "@ember-data/model";

export default class CostCenter extends Model {
  @attr("string")
  declare name?: string;
  @attr("string")
  declare reference?: string;
}

declare module "ember-data/types/registries/model" {
  interface ModelRegistry {
    "cost-center": CostCenter;
  }
}
