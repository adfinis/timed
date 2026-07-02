import { deprecate } from "@ember/debug";
import Component from "@glimmer/component";
import UIModal from "ui-core/components/ui-modal";

import { TARGET_ID } from "timed/components/modal-target";

/** @param {((e: Event) => void)=} onClose */
const optional = (onClose) => {
  const hasNoOnClose = !onClose;
  // TODO: remove this once we fix usages of the Modal component
  deprecate(
    "Not passing `@onClose` to a Modal component is deprecated. Refactor this component to pass a dedicated closing function.",
    !hasNoOnClose,
    {
      id: "timed.modal.missing-on-close",
      until: "6.0.0",
      for: "timed",
      since: {
        available: "5.15.0",
      },
    },
  );

  if (hasNoOnClose) {
    return () => {};
  }

  return onClose;
};
export default class Modal extends Component {
  get target() {
    return document.getElementById(TARGET_ID);
  }

  <template>
    <UIModal
      @target={{this.target}}
      @onClose={{optional @onClose}}
      @visible={{@visible}}
      ...attributes
      as |m|
    >
      {{yield m}}
    </UIModal>
  </template>
}
