import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class SubNavItemComponent extends Component {
  @service router;

  get isActive() {
    return this.router.currentRoute?.name.includes(this.args.route);
  }
}
