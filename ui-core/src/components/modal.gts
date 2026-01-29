import type { TOC } from "@ember/component/template-only";
import Component from "@glimmer/component";
import type { ComponentLike, WithBoundArgs } from "@glint/template";
import Card, { CardBlock, CardFooter, CardHeader } from "./card.gts";
import { on } from "@ember/modifier";
import { hash } from "@ember/helper";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { focusTrap } from "ember-focus-trap";

export interface ModalHeaderSignature {
  Args: {
    onClose: (e: Event) => void;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

export interface ModalSegmentSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

export interface ModalOverlaySignature {
  Args: {
    visible: boolean;
    onClose: (e: Event) => void;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

export interface ModalSignature {
  Args: {
    onClose: (e: Event) => void;
    visible: boolean;
  };
  Blocks: {
    default: [
      {
        header: WithBoundArgs<ComponentLike<ModalHeaderSignature>, "onClose">;
        body: ComponentLike<ModalSegmentSignature>;
        footer: ComponentLike<ModalSegmentSignature>;
      },
    ];
  };
  Element: HTMLElement;
}

const ModalHeader = <template>
  <CardHeader
    ...attributes
    class="modal-header grid grid-cols-[minmax(0,1fr),auto]"
  >
    <div>{{yield}}</div>
    <button
      type="button"
      class="close"
      aria-label="Close"
      {{on "click" @onClose}}
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </CardHeader>
</template> satisfies TOC<ModalHeaderSignature>;

const ModalBody = <template>
  <CardBlock
    class="modal-body bg-background max-h-[calc(85dvh-1.5rem)] overflow-y-auto overflow-x-hidden"
    ...attributes
  >
    {{yield}}
  </CardBlock>
</template> satisfies TOC<ModalSegmentSignature>;

class ModalOverlay extends Component<ModalOverlaySignature> {
  id: string;

  constructor(
    ...args: ConstructorParameters<typeof Component<ModalOverlaySignature>>
  ) {
    super(...args);
    this.id = guidFor(this);
  }

  @action
  handleClick(e: Event) {
    if ((e.target as HTMLElement).id === this.id) {
      this.args.onClose(e);
    }
  }

  <template>
    <div
      class="modal modal-overlay bg-foreground-muted/30 fixed z-50 flex items-start justify-center p-5
        {{if @visible 'pointer-events-all opacity-100'}}
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

class Modal extends Component<ModalSignature> {
  get target() {
    return document.getElementById("modals")!;
  }

  <template>
    {{#if @visible}}
      {{#in-element this.target insertBefore=null}}
        <ModalOverlay @visible={{@visible}} @onClose={{@onClose}}>
          <Card {{focusTrap}} class="z-50 max-h-[100%] w-full" ...attributes>
            {{yield
              (hash
                footer=CardFooter
                body=ModalBody
                header=(component ModalHeader onClose=@onClose)
              )
            }}
          </Card>
        </ModalOverlay>
      {{/in-element}}
    {{/if}}
  </template>
}

export default Modal;
