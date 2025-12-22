declare module "ember-keyboard" {
  export function keyResponder(target: unknown): void;
  export function onKey(keyCombo: string, event?: unknown): MethodDecorator;
}
