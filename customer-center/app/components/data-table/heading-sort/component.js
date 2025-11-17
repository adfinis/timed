import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

/**
 * @arg onSort
 */
export default class DataTableHeadingSortComponent extends Component {
  @tracked order;

  orders = ["ASC", "DESC"];
  icons = ["triangle-up", "triangle-down"];

  get icon() {
    if (this.order) {
      const index = this.orders.indexOf(this.order);
      return this.icons[index];
    }

    return null;
  }

  @action sort() {
    const index = (this.orders.indexOf(this.order) + 1) % 2;
    this.order = this.orders[index];

    if (this.args.onSort) {
      this.args.onSort(this.order);
    }
  }
}
