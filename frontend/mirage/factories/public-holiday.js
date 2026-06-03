import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory } from "miragejs";

export default Factory.extend({
  name: () => faker.lorem.word(),
  // location: association(),

  date() {
    const random = faker.date.between({
      from: DateTime.now().startOf("year").toISODate(),
      to: DateTime.now().endOf("year").toISODate(),
    });

    return DateTime.fromJSDate(random).startOf("day");
  },

  afterCreate(publicHoliday, server) {
    publicHoliday.update({ locationId: server.create("location").id });
  },
});
