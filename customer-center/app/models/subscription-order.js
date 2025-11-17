import Model, { attr, belongsTo } from "@ember-data/model";
import { memberAction } from "ember-api-actions";
import moment from "moment";

export default class TimedSubscriptionOrderModel extends Model {
  @attr({ defaultValue: false }) acknowledged;

  @attr("django-duration") duration;
  @attr("django-datetime", { defaultValue: () => moment() }) ordered;

  @belongsTo("subscription-project") project;

  confirm = memberAction({ path: "confirm", type: "post" });
}
