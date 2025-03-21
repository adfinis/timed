import Model, { attr, belongsTo } from "@ember-data/model";

export default class UserStatistic extends Model {
  @attr("django-duration") duration;

  @belongsTo("user", { async: true, inverse: null }) user;
}
