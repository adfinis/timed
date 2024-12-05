import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";

export default class Checkbox extends Component {
  constructor(...args) {
    super(...args);

    this.checkboxElementId = guidFor(this);
  }
}
