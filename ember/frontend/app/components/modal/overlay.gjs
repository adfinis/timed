import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";
import { on } from "@ember/modifier";

export default class ModalOverlay extends Component {
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
  <template>
    <div
      class="modal modal-overlay bg-foreground-muted/30 fixed z-50 flex items-start justify-center p-5
        {{if @visible 'modal--visible pointer-events-all opacity-100'}}
        bg-background inset-0 p-6"
      id={{this.id}}
      {{! template-lint-disable no-invalid-interactive }}
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
