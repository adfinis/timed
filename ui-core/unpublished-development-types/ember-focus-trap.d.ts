declare module "ember-focus-trap" {
  import Modifier from "ember-modifier";

  type FocusTrapOptions = {
    initialFocus?: string;
    fallbackFocus?: string;
    escapeDeactivates?: () => boolean;
    allowOutsideClick?: boolean;
    clickOutsideDeactivates?: (Event) => boolean;
  };

  interface Signature {
    Element: HTMLElement;
    Args: {
      Positional: [];
      Named: {
        isActive?: boolean;
        additionalElements?: string[] | Element[];
        focusTrapOptions?: FocusTrapOptions;
        shouldSelfFocus?: boolean;
      };
    };
  }

  declare class focusTrap extends Modifier<Signature> {}
  export { focusTrap };
}
