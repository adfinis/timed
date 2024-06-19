import faker from "faker";
import { Factory } from "miragejs";

export default Factory.extend({
  name: () => faker.address.city(),
  workdays: () => "1,2,3,4,5",
});
