import { tracked } from "@glimmer/tracking";
import { Duration } from "luxon";

export default class SplitReport {
  @tracked task;
  @tracked comment;
  @tracked duration;
  @tracked notBillable;
  @tracked review;

  constructor({
    task = null,
    comment = "",
    duration = Duration.fromMillis(0),
    notBillable = false,
    review = false,
  }) {
    this.task = task;
    this.comment = comment;
    this.duration = duration;
    this.notBillable = notBillable;
    this.review = review;
  }
}
