import { tracked } from "@glimmer/tracking";
import { Duration } from "luxon";

export default class SplitReport {
  @tracked task;
  @tracked comment;
  @tracked duration;

  constructor(task = null, comment = "", duration = Duration.fromMillis(0)) {
    this.task = task;
    this.comment = comment;
    this.duration = duration;
  }
}
