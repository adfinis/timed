import { capitalize } from "@ember/string";
import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  name: () => capitalize(faker.hacker.ingverb()),
  estimatedTime: () => randomDuration(),

  afterCreate(task, server) {
    task.update({ projectId: server.create("project").id });
  },
});
