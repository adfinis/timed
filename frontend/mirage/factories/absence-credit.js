import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";
import moment from "moment";

export default Factory.extend({
  date: () => moment().format("YYYY-MM-DD"),
  days: () => faker.number.int({ min: 1, max: 25 }),
  comment: () => faker.lorem.sentence(),

  afterCreate(absenceCredit, server) {
    absenceCredit.update({ absenceTypeId: server.db.absenceTypes[0].id });
  },
});
