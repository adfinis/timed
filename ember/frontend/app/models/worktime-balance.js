import Model, { attr, belongsTo } from "@ember-data/model";

import { MODES as m } from "timed/transforms/luxon-dt";

export default class WorktimeBalance extends Model {
  @attr("luxon-dt", { t: m.date }) date;
  @attr("django-duration") balance;
  @belongsTo("user", { async: true, inverse: "worktimeBalances" }) user;
}
