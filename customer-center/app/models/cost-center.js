import Model, { attr } from "@ember-data/model";

export default class TimedCostCenterModel extends Model {
  @attr name;
  @attr reference;
}
