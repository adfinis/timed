import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";
import moment from "moment";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  date: () => moment().format("YYYY-MM-DD"),
  duration: () => randomDuration(),
  comment: () => faker.lorem.sentence(),
});
