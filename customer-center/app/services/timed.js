import Service, { inject as service } from "@ember/service";

export default class TimedService extends Service {
  @service store;

  async getAllProjects() {
    return await this.store.query("subscription-project", {
      include: "billing_type,customer,orders,cost_center",
      ordering: "name",
    });
  }

  async getDashboardProjects() {
    const projects = await this.store.findAll("subscription-project");

    return projects
      .toArray()
      .sort((a, b) => a.totalTime - b.totalTime)
      .slice(0, 4);
  }

  async getOwnProjects() {
    return await this.store.query("subscription-project", {
      ordering: "name",
    });
  }

  async getUnconfirmedOrders() {
    return await this.store.query("subscription-order", {
      include: "project,project.customer",
      ordering: "-ordered",
      acknowledged: 0,
    });
  }

  async getProjectDetails(project) {
    return await this.store.findRecord("subscription-project", project, {
      include: "billing_type,customer",
    });
  }

  async getProjectReports(project, page = 1) {
    return await this.store.query("report", {
      project,
      include: "user",
      ordering: "-date",
      not_billable: 0,
      page: {
        number: page,
        size: 10,
      },
    });
  }

  async getProjectOrders(project, page = 1) {
    return await this.store.query("subscription-order", {
      ordering: "-ordered",
      project,
      page: {
        number: page,
        size: 10,
      },
    });
  }

  async placeSubscriptionOrder(project, duration, ordered) {
    const order = this.store.createRecord("subscription-order", {
      duration,
      project,
      ordered,
    });

    await order.save();

    return order;
  }

  async acceptSubscriptionOrder(order) {
    order.set("acknowledged", true);
    await order.confirm();
    order.unloadRecord();
  }

  async denySubscriptionOrder(order) {
    await order.destroyRecord();
  }
}
