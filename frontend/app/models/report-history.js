/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

export default class ReportHistory extends Model {
  @attr("string", { defaultValue: "" }) comment;
  @attr("django-datetime") createdAt;
  @belongsTo("report", { async: false, inverse: "history" }) report;
  @belongsTo("task", { async: true, inverse: null }) previous;
  @belongsTo("task", { async: true, inverse: null }) next;
  @belongsTo("user", { async: true, inverse: null }) actor;
}
