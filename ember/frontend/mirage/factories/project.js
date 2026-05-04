import { faker } from "@faker-js/faker";
import { Factory, association, trait } from "miragejs";

import { randomDuration } from "../helpers/duration";

export default Factory.extend({
  name: () => faker.commerce.productName(),
  estimatedTime: () => randomDuration(),

  afterCreate(project, server) {
    project.update({ customerId: server.create("customer").id });
  },

  withBillingType: trait({
    billingType: association(),
  }),
});
