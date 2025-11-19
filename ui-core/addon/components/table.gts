import type { TOC } from '@ember/component/template-only';

export interface TableSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLTableElement;
}

export interface TdSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLTableCellElement;
}

export interface ThSignature {
  Args: { light: boolean };
  Blocks: {
    default: [];
  };
  Element: HTMLTableCellElement;
}

export interface TrSignature {
  Args: {
    striped: boolean;
    hover: boolean;
    last: boolean;
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
  <table class="w-full" ...attributes>
    {{yield}}
  </table>
</template> satisfies TOC<TableSignature>;

export { Td, Th, Tr, Tfoot, Thead };
export default Table;
