import { service } from "@ember/service";
import Model, { attr, belongsTo } from "@ember-data/model";
import { DateTime } from "luxon";

import { MODES as m } from "timed/transforms/luxon-dt";

export default class Activity extends Model {
  /** @type {DateTime} */
  @attr("luxon-dt", { t: m.time }) fromTime;
  /** @type {DateTime} */
  @attr("luxon-dt", { t: m.time }) toTime;

  @attr("string", { defaultValue: "" }) comment;
  /** @type {DateTime} */
  @attr("luxon-dt", { t: m.date }) date;
  @attr("boolean", { defaultValue: false }) transferred;
  @attr("boolean", { defaultValue: false }) review;
  @attr("boolean", { defaultValue: false }) notBillable;
  @belongsTo("task", { async: true, inverse: null }) task;
  @belongsTo("user", { async: true, inverse: null }) user;

  @service notify;
  @service store;

  get active() {
    return !this.toTime && !!this.id;
  }

  get duration() {
    return (this.to ?? DateTime.now()).diff(this.from);
  }

  get from() {
    const time = this.fromTime;
    return (
      time &&
      this.date.set({
        hour: time.hour,
        minute: time.minute,
        second: time.second,
        millisecond: time.millisecond,
      })
    );
  }

  set from(value) {
    this.fromTime = value;
  }

  get to() {
    const time = this.toTime;
    return (
      time &&
      this.date.set({
        hour: time.hour,
        minute: time.minute,
        second: time.second,
        millisecond: time.millisecond,
      })
    );
  }

  set to(value) {
    this.toTime = value;
  }

  async start() {
    const activity = await this.store.createRecord("activity", {
      date: DateTime.now(),
      fromTime: DateTime.now(),
      task: await this.task,
      comment: this.comment,
      review: await this.review,
      notBillable: this.notBillable,
    });

    await activity.save();

    return activity;
  }

  /**
   * Stop the activity
   *
   * If the activity was started yesterday, we create a new identical
   * activity today so we handle working over midnight
   *
   * If the activity was started even before, we ignore it since it must be
   * a mistake, so we end the activity a second before midnight that day
   *
   * @method stop
   * @public
   */
  async stop() {
    /* istanbul ignore next */
    if (!this.active) {
      return;
    }

    const activities = [this];

    if (Math.floor(DateTime.now().diff(this.date, "days").as("days")) === 1) {
      activities.push(
        this.store.createRecord("activity", {
          task: await this.task,
          comment: this.comment,
          user: await this.user,
          date: this.date.plus({ days: 1 }),
          review: this.review,
          notBillable: this.notBillable,
          fromTime: DateTime.fromObject({ hour: 0, minute: 0, second: 0 }),
        }),
      );
    }

    await Promise.all(
      activities.map(async (activity) => {
        if (activity.get("isNew")) {
          await activity.save();
        }

        activity.toTime = DateTime.fromMillis(
          Math.min(activity.get("date").endOf("day"), DateTime.now()),
        );

        await activity.save();
      }),
    );

    if (DateTime.now().diff(this.date, "days").as("days") > 1) {
      this.notify.info(
        "The activity overlapped multiple days, which is not possible. The activity was stopped at midnight of the day it was started.",
        { closeAfter: 5000 },
      );
    }
  }
}
