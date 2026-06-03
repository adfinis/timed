import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory } from "miragejs";

export default Factory.extend({
  date: () => DateTime.now().toISODate(),
  days: () => faker.number.int({ min: 1, max: 25 }),
  comment: () => faker.lorem.sentence(),

  afterCreate(absenceCredit, server) {
    absenceCredit.update({ absenceTypeId: server.db.absenceTypes[0].id });
  },
});
