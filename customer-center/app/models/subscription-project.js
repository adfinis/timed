import Model, { attr, hasMany, belongsTo } from "@ember-data/model";
import moment from "moment";

import ENV from "customer-center/config/environment";

export default class TimedSubscriptionProjectModel extends Model {
  @attr name;
  @attr("django-duration") purchasedTime;
  @attr("django-duration") spentTime;

  @hasMany("subscription-order") orders;
  @belongsTo("billing-type") billingType;
  @belongsTo("customer") customer;
  @belongsTo("cost-center") costCenter;

  get totalTime() {
    return moment.duration(this.purchasedTime - this.spentTime);
  }

  get unconfirmedTime() {
    return this.orders
      .filter((order) => order !== null)
      .filter((order) => !order.acknowledged)
      .reduce(
        (accumulator, order) => accumulator.add(order.duration),
        moment.duration()
      );
  }

  get isTimeAlmostConsumed() {
    return this.totalTime.asHours() <= ENV.APP.ALERT_TIME;
  }

  get percentage() {
    return this.totalTime < 0 ? 0 : this.totalTime / this.purchasedTime;
  }

  /** This value is used to create the correct CSS classes. */
  get percentageGroup() {
    return this.percentage.toFixed(1) * 10;
  }
}
