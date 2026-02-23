declare module "ember-keyboard" {
  export function keyResponder(target: unknown): void;
  export function onKey(keyCombo: string, event?: unknown): MethodDecorator;
}

declare module "ember-keyboard/services/keyboard" {
  import Service from "@ember/service";
  declare class KeyboardService extends Service {}
  export default KeyboardService;
}
