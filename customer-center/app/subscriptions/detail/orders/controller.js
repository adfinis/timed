import Controller from "@ember/controller";
import { get } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency";

export default class SubscriptionsDetailOrdersController extends Controller {
  @service account;
  @service intl;
  @service timed;

  @tracked project;
  @tracked orders;
  @tracked ordersNext;
  @tracked reports;
  @tracked reportsNext;

  @dropTask *fetchNextOrders() {
    try {
      this.ordersPage++;
      const orders = yield this.timed.getProjectOrders(
        this.project.id,
        this.ordersPage
      );
      this.orders.pushObjects(orders.toArray());

      this.ordersNext = Boolean(get(orders, "links.next"));
    } catch (error) {
      console.error(error);
      this.ordersNext = false;
    }
  }

  setup(model, transition) {
    this.project = model.project;

    this.orders = model.orders.toArray();
    this.ordersPage = 1;
    this.ordersNext = Boolean(get(model, "orders.links.next"));
  }
}
