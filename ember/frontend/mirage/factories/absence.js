import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";
import moment from "moment";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment().format("YYYY-MM-DD"),
  duration: () => "08:30:00",

  afterCreate(absence, server) {
    absence.update({
      absenceTypeId: server.schema.absenceTypes.all().models[0].id,
    });
  },
});
