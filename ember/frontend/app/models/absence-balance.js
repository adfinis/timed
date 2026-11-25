import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class AbsenceBalance extends Model {
  @attr("number") credit;
  @attr("number") usedDays;
  @attr("django-duration") usedDuration;
  @attr("number") balance;
  @belongsTo("user", { async: false, inverse: "absenceBalances" }) user;
  @belongsTo("absence-type", { async: false, inverse: "absenceBalances" })
  absenceType;
  @hasMany("absence-credit", { async: true, inverse: null }) absenceCredits;

  get isDuration() {
    return !!this.usedDuration;
  }

  get isHoliday() {
    return !!this.credit;
  }

  get type() {
    if (this.isDuration) return "duration";
    if (this.isHoliday) return "holiday";
    return "day";
  }
}
