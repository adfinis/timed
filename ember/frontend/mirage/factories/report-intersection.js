import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  notBillable: () => faker.datatype.boolean(),
  review: () => faker.datatype.boolean(),
  verified: () => faker.datatype.boolean(),

  afterCreate(intersection, server) {
    const task = server.create("task");

    intersection.update({
      customerId: task.project.customer.id,
      projectId: task.project.id,
      taskId: task.id,
    });
  },
});
