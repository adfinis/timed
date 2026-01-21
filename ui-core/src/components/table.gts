import type { TOC } from "@ember/component/template-only";
import { hash } from "@ember/helper";
import type { ComponentLike, WithBoundArgs } from "@glint/template";
import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { and, not } from "ember-truth-helpers";

export interface TdSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLTableCellElement;
}

export interface ThSignature {
  Args: { light?: boolean };
  Blocks: {
    default: [];
  };
  Element: HTMLTableCellElement;
}

export interface TrSignature {
  Args: {
    striped?: boolean;
    hover?: boolean;
    last?: boolean;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLTableRowElement;
}

export interface SelectableTrSignature {
  Args: {
    active?: boolean;
    selected?: boolean;
    selectable?: boolean;
    disabled?: boolean;
    last?: boolean;
    onChange?: (e: MouseEvent | KeyboardEvent) => void;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLTableRowElement;
}

export interface TfootSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLTableSectionElement;
}

type TheadSignature = TfootSignature;
type TbodySignature = TfootSignature;

export interface TableSignature {
  Args: {
    striped?: boolean;
    hover?: boolean;
    last?: boolean;
  };
  Blocks: {
    default: [
      {
        tr: WithBoundArgs<
          ComponentLike<TrSignature>,
          keyof TableSignature["Args"]
        >;
        trh: ComponentLike<TrSignature>;
        th: ComponentLike<ThSignature>;
        td: ComponentLike<ThSignature>;
        tbody: ComponentLike<TbodySignature>;
        tfoot: ComponentLike<TfootSignature>;
        thead: ComponentLike<TheadSignature>;
      },
    ];
  };
  Element: HTMLTableElement;
}

export interface SelectableTableSignature {
  Element: HTMLTableElement;
  Args: { last?: boolean };
  Blocks: {
    default: [
      {
        tr: ComponentLike<SelectableTrSignature>;
        trh: ComponentLike<TrSignature>;
        th: ComponentLike<ThSignature>;
        td: ComponentLike<ThSignature>;
        tbody: ComponentLike<TbodySignature>;
        tfoot: ComponentLike<TfootSignature>;
        thead: ComponentLike<TheadSignature>;
      },
    ];
  };
}

const Tfoot = <template>
  <tfoot class="border-b-border/50 border-t-2" ...attributes>
    {{yield}}
  </tfoot>
</template> satisfies TOC<TfootSignature>;

const Thead = <template>
  <thead class="border-b-border/50 border-b-2" ...attributes>
    {{yield}}
  </thead>
</template> satisfies TOC<TheadSignature>;

const Tbody = <template>
  <tbody ...attributes>{{yield}}</tbody>
</template> satisfies TOC<TbodySignature>;

const Tr = <template>
  <tr
    class="{{if @striped 'striped'}}
      {{if
        @hover
        'hover:bg-secondary-dark/15 cursor-pointer transition-colors'
      }}
      {{if @last 'last-of-type:border-b-2'}}"
    ...attributes
  >{{yield}}</tr>
</template> satisfies TOC<TrSignature>;

class SelectableTr extends Component<SelectableTrSignature> {
  _onEvent = (e: MouseEvent | KeyboardEvent) => {
    const { onChange, disabled, selectable } = this.args;
    if (!onChange || disabled || !selectable) {
      return;
    }
    onChange(e);
  };

  _onKeydown = (e: KeyboardEvent) => {
    // if selected via tab, make enter select the row
    if (
      e.key !== "Enter" ||
      !(e.target! as HTMLElement).querySelector(":focus-visible *")
    ) {
      return;
    }
    this._onEvent(e);
  };

  get selectable() {
    const { disabled, selectable } = this.args;
    return !disabled && selectable;
  }

  <template>
    <tr
      {{on "click" this._onEvent}}
      {{on "keydown" this._onKeydown}}
      role="link"
      tabindex={{if this.selectable "0"}}
      aria-disabled={{if this.selectable "false" "true"}}
      class="{{if
          @selected
          'selected bg-primary !text-foreground-primary'
          'striped'
        }}
        {{if (and @active (not @selected)) 'active !bg-primary/20'}}
        {{if @disabled 'transferred !text-foreground-muted cursor-not-allowed'}}
        {{if
          this.selectable
          'text-foreground-accent cursor-pointer'
          'text-foreground/90'
        }}
        {{if
          (and this.selectable (not @selected))
          'hover:bg-secondary-dark/15'
        }}
        shadow-foreground/5 align-top shadow transition-colors
        {{if @last 'last-of-type:border-b-2'}}"
      ...attributes
    >{{yield}}</tr>
  </template>
}

const Td = <template>
  <td
    class="border-border/50 border-t p-2 align-top"
    ...attributes
  >{{yield}}</td>
</template> satisfies TOC<TdSignature>;

const Th = <template>
  <th
    class="p-2 text-left bg-background align-bottom
      {{if @light 'font-normal' 'font-medium'}}"
    ...attributes
  >
    {{yield}}
  </th>
</template> satisfies TOC<ThSignature>;

const Table = <template>
  <table class="w-full table" ...attributes>
    {{yield
      (hash
        td=Td
        th=Th
        tbody=Tbody
        thead=Thead
        tfoot=Tfoot
        trh=Tr
        tr=(component Tr striped=@striped hover=@hover last=@last)
      )
    }}
  </table>
</template> satisfies TOC<TableSignature>;

const SelectableTable = <template>
  <table class="w-full table" ...attributes>
    {{yield
      (hash
        td=Td th=Th thead=Thead tfoot=Tfoot tbody=Tbody trh=Tr tr=SelectableTr
      )
    }}
  </table>
</template> satisfies TOC<SelectableTableSignature>;

export { Td, Th, Tr, Tbody, Tfoot, Thead, SelectableTr, SelectableTable };
export default Table;
