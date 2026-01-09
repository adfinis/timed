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
    onClick?: (e: MouseEvent) => void;
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
        tfoot: ComponentLike<TfootSignature>;
        thead: ComponentLike<TheadSignature>;
      },
    ];
  };
  Element: HTMLTableElement;
}

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
        tfoot: ComponentLike<TfootSignature>;
        thead: ComponentLike<TheadSignature>;
      },
    ];
  };
  Element: HTMLTableElement;
}

export type SelectableTableSignature = Pick<TableSignature, "Element"> & {
  Args: Pick<TableSignature["Args"], "last">;
  Blocks: {
    default: Omit<TableSignature["Blocks"]["default"][0], "tr"> & {
      tr: ComponentLike<SelectableTrSignature>;
    };
  };
};

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
  _onClick = (e: MouseEvent) => {
    const { onClick, disabled, selectable } = this.args;
    if (!onClick || disabled || !selectable) {
      return;
    }
    onClick(e);
  };

  get selectable() {
    const { disabled, selectable } = this.args;
    return !disabled && selectable;
  }

  <template>
    <tr
      {{on "click" this._onClick}}
      role="button"
      class="{{if
          @selected
          'selected bg-primary text-foreground-primary'
          'striped'
        }}
        {{if (and @active (not @selected)) 'active !bg-primary/20'}}
        {{if @disabled 'transferred text-foreground-muted cursor-not-allowed'}}
        {{if this.selectable 'text-foreground-accent cursor-pointer'}}
        {{if (and this.selectable (not @selected)) 'hover:bg-secondary-dark/15'}}
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
    class="p-2 text-left align-bottom {{if @light 'font-normal' 'font-medium'}}"
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
    {{yield (hash td=Td th=Th thead=Thead tfoot=Tfoot trh=Tr tr=SelectableTr)}}
  </table>
</template> satisfies TOC<SelectableTableSignature>;

export { Td, Th, Tr, Tfoot, Thead, SelectableTr, SelectableTable };
export default Table;
