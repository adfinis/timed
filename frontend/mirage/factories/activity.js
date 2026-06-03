import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory, trait } from "miragejs";

const TIME_FORMAT = "HH:mm:ss";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  transferred: false,
  review: faker.datatype.boolean(),
  notBillable: faker.datatype.boolean(),
  // task: association(),

  date: () => DateTime.now(),

  fromTime() {
    return this.date.toFormat(TIME_FORMAT);
  },

  toTime() {
    const start = DateTime.fromFormat(this.fromTime, TIME_FORMAT);

    return start
      .plus({ minutes: faker.number.int({ min: 15, max: 60 }) })
      .plus({ seconds: faker.number.int({ min: 0, max: 59 }) })
      .toFormat(TIME_FORMAT);
  },

  afterCreate(activity, server) {
    activity.update({ taskId: server.create("task").id });
    activity.update({
      duration: (activity.toTime
        ? DateTime.fromFormat(activity.toTime, TIME_FORMAT)
        : DateTime.now()
      ).diff(DateTime.fromFormat(activity.fromTime, TIME_FORMAT)),
    });
  },

  active: trait({
    toTime: null,
  }),

  unknown: trait({
    afterCreate(activity) {
      activity.task.destroy();
    },
  }),

  defineTask: trait({
    afterCreate(activity) {
      activity.update({ taskId: activity.definedTask });
    },
  }),
});
