import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class Toggle extends Component {
  @action
  handleKeyUp(event) {
    // only trigger on "Space" key
    if (event.keyCode === 32 && !this.args.disabled) {
      this.args.onToggle();
    }
  }
}
