import faker from "faker";
import { Factory } from "miragejs";

export default Factory.extend({
  name: () => faker.finance.accountName(),
  reference: () => faker.finance.account(),
});
