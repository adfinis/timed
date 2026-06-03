import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory } from "miragejs";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => DateTime.now().toISODate(),
  duration: () => randomDuration(),
  review: () => faker.datatype.boolean(),
  notBillable: () => faker.datatype.boolean(),
  verifiedBy: null,

  afterCreate(report, server) {
    report.update({ taskId: server.create("task").id });
  },
});
