import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class AbsenceBalance extends Model {
  @attr("number") credit;
  @attr("number") usedDays;
  @attr("django-duration") usedDuration;
  @attr("number") balance;
  @belongsTo("user", { async: true, inverse: null }) user;
  @belongsTo("absence-type", { async: true, inverse: null }) absenceType;
  @hasMany("absence-credit", { async: true, inverse: null }) absenceCredits;
}
