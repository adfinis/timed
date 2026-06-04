import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory } from "miragejs";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => DateTime.now().toISODate(),
  duration: () => "08:30:00",

  afterCreate(absence, server) {
    absence.update({
      absenceTypeId: server.schema.absenceTypes.all().models[0].id,
    });
  },
});
