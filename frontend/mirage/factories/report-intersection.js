import faker from "faker";
import { Factory } from "miragejs";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  notBillable: () => faker.random.boolean(),
  review: () => faker.random.boolean(),
  verified: () => faker.random.boolean(),

  afterCreate(intersection, server) {
    const task = server.create("task");

    intersection.update({
      customerId: task.project.customer.id,
      projectId: task.project.id,
      taskId: task.id,
    });
  },
});
