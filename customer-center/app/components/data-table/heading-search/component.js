import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

/**
 * @arg onSearch
 */
export default class DataTableHeadingFilterComponent extends Component {
  @tracked query;

  get id() {
    return guidFor(this);
  }

  @action clear(event) {
    this.query = "";

    if (this.args.onSearch) {
      this.args.onSearch(this.query);
    }
  }

  @action search(event) {
    // The search action is executed before
    // the Input component updates its @value.
    this.query = event.target.value;

    if (this.args.onSearch) {
      this.args.onSearch(this.query);
    }
  }
}
