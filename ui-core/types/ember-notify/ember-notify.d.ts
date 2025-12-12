declare module "ember-notify/components/ember-notify" {
  import Component from "@glimmer/component";

  interface Message {
    text: string;
  }

  interface EmberNotifySignature {
    Args: {
      messageStyle?:
        | "foundation"
        | "foundation-5"
        | "uikit"
        | "refills"
        | "bootstrap"
        | "semantic-ui";
    };
    Blocks: {
      default: [message: Message, close: (event: PointerEvent) => void];
    };
  }

  declare class EmberNotify extends Component<EmberNotifySignature> {}
  export default EmberNotify;
}
