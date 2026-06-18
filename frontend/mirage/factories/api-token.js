import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { Factory } from "miragejs";

export default Factory.extend({
  name: () => faker.lorem.word(),
  token: null,
  created: () => DateTime.now().toISO(),
  lastUsedAt: null,
  expiresAt: null,
  revoked: false,
});
