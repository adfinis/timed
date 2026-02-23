import { on } from "@ember/modifier";
import type { TOC } from "@ember/component/template-only";
import { uniqueId } from "@ember/helper";
import { pick } from "@nullvoxpopuli/ember-composable-helpers";

export interface CheckboxSignature {
  Args: {
    disabled?: boolean;
    title?: string;
    label?: string;
    onChange: (value: boolean) => void;
    checked: boolean;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

const Checkbox = <template>
  {{#let (uniqueId) as |id|}}
    <div ...attributes>
      <input
        type="checkbox"
        id={{id}}
        checked={{@checked}}
        disabled={{@disabled}}
        {{on "change" (pick "target.checked" @onChange)}}
      />
      <label for={{id}} title={{@title}} class="text-sm xl:text-base">
        {{#if (has-block)}}
          {{yield}}
        {{else}}
          {{#if @label}}
            {{@label}}
          {{/if}}
        {{/if}}
      </label>
    </div>
  {{/let}}
</template> satisfies TOC<CheckboxSignature>;

export default Checkbox;
