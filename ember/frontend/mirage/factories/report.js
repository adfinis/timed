import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";
import moment from "moment";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment().format("YYYY-MM-DD"),
  duration: () => randomDuration(),
  review: () => faker.datatype.boolean(),
  notBillable: () => faker.datatype.boolean(),
  verifiedBy: null,

  afterCreate(report, server) {
    report.update({ taskId: server.create("task").id });
  },
});
