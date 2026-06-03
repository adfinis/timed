import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory } from "miragejs";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => DateTime.now().toISODate(),
  duration: () => randomDuration(),
  comment: () => faker.lorem.sentence(),
});
