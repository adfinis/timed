import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";

export default class SyModalOverlay extends Component {
  constructor(...args) {
    super(...args);

    this.id = guidFor(this);
  }

  @action
  handleClick(e) {
    if (e.target.id === this.id) {
      this.args.onClose();
    }
  }
}
