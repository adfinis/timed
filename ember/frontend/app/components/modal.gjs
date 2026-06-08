import { array, hash } from "@ember/helper";
import Component from "@glimmer/component";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import focusTrap from "ember-focus-trap/modifiers/focus-trap";

import ModalBody from "timed/components/modal/body";
import ModalFooter from "timed/components/modal/footer";
import ModalHeader from "timed/components/modal/header";
import Overlay from "timed/components/modal/overlay";

export default class Modal extends Component {
  get target() {
    return document.getElementById("modals");
  }
  <template>
    {{#if @visible}}
      {{#in-element this.target insertBefore=null}}
        <Overlay
          @visible={{@visible}}
          @onClose={{optional @onClose}}
          {{focusTrap additionalElements=(array this.target)}}
        >
          <div
            class="modal-dialog bg-background z-50 max-h-[100%] w-full rounded border"
            ...attributes
          >
            {{yield
              (hash
                header=(component ModalHeader close=(optional @onClose))
                body=(component ModalBody close=(optional @onClose))
                footer=(component ModalFooter close=(optional @onClose))
                close=(optional @onClose)
              )
            }}
          </div>
        </Overlay>
      {{/in-element}}
    {{/if}}
  </template>
}
