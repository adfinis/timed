import Model, { attr, belongsTo } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

export default class OvertimeCredit extends Model {
  @attr("luxon-dt", { t: m.date }) date;
  @attr("django-duration") duration;
  @attr("string", { defaultValue: "" }) comment;
  @belongsTo("user", { async: false, inverse: null }) user;
}
