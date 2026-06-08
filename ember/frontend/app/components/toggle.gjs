import { concat } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import { or } from "ember-truth-helpers";

export default class Toggle extends Component {
  @action
  handleKeyUp(event) {
    // only trigger on "Space" key
    if (event.keyCode === 32 && !this.args.disabled) {
      this.args.onToggle();
    }
  }
  <template>
    <div
      ...attributes
      class="toggle
        {{if @value 'active text-warning-light' 'inactive text-secondary'}}
        mx-0.5 grid place-self-center stroke-slate-600 p-1 text-xl"
      title={{concat @hint (if @disabled " (disabled)")}}
      tabindex="0"
      role="link"
      {{on "click" (optional (unless @disabled @onToggle))}}
      {{on "keyup" this.handleKeyUp}}
    >
      {{#if (has-block)}}
        {{yield}}
      {{else}}
        <FaIcon @icon={{@icon}} @fixedWidth={{true}} @size={{or @size "1x"}} />
      {{/if}}
    </div>
  </template>
}
