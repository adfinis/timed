import Component from "@glimmer/component";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import and from "ember-truth-helpers/helpers/and";

export default class Checkmark extends Component {
  get icon() {
    return this.args.checked ? "check-square" : "square";
  }
  <template>
    <FaIcon
      class="{{if (and @highlight @checked) 'highlight'}}"
      ...attributes
      @icon={{this.icon}}
    />
  </template>
}
