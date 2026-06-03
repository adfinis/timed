import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory, trait } from "miragejs";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => DateTime.now(),
  balance: () => randomDuration(),

  days: trait({
    credit: () => faker.number.int({ min: 10, max: 20 }),
    usedDays: () => faker.number.int({ min: 5, max: 25 }),
  }),

  duration: trait({
    usedDuration: () => randomDuration(),
  }),
});
