import Model, { attr, hasMany } from "@ember-data/model";

export default class TimedBillingTypeModel extends Model {
  @attr name;

  @hasMany("subscription-project") projects;
  @hasMany("subscription-package") packages;
}
