import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  name: () => faker.finance.accountName(),
  reference: () => faker.finance.accountNumber(),
});
