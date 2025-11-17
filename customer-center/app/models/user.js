import Model, { attr, hasMany } from "@ember-data/model";

export default class TimedUserModel extends Model {
  @attr("string") firstName;
  @attr("string") lastName;
  @attr("string") username;
  @attr("string") email;

  @attr("boolean") isSuperuser;
  @attr("boolean") isAccountant;
  @attr("boolean") isActive;

  @hasMany("reports") reports;

  /** The groups are an array of strings. */
  @attr groups;

  /** Returns the first and/or last name. */
  get fullName() {
    return [this.firstName, this.lastName].filter(Boolean).join(" ");
  }
}
