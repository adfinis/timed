import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  name: () => faker.location.city(),
  workdays: () => "1,2,3,4,5",
});
