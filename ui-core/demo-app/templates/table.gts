import Component from "@glimmer/component";
import Table, { SelectableTable } from "#src/components/table.gts";
import pageTitle from "ember-page-title/helpers/page-title";
import { tracked } from "@glimmer/tracking";
import Checkbox from "#src/components/checkbox.gts";
import { fn } from "@ember/helper";
import PageHeading from "../components/page-heading.gts";
import { eq } from "ember-truth-helpers";
import { on } from "@ember/modifier";

const VALUES = [
  ["foo", "bar"],
  ["baz", "abc"],
  ["deadbeef", "12345"],
  ["abcde", "fghijkl"],
] as const;

export default class TableTemplate extends Component {
  @tracked striped = true;
  @tracked hover = false;
  @tracked last = false;
  @tracked light = false;

  @tracked active = null as Nullable<number>;
  @tracked selected = null as Nullable<number>;

  @tracked selected2 = [] as Array<number>;

  setSelected = (i: number) => () => {
    this.selected = i;
  };

  setActive = () => {
    this.active = this.selected;
  };

  toggleSelection = (i: number) => () => {
    if (this.selected2.includes(i)) {
      this.selected2 = this.selected2.filter((j) => j !== i);
      return;
    }
    this.selected2 = [...this.selected2, i];
  };

  isSelected = (i: number) => this.selected2.includes(i);

  <template>
    {{pageTitle "Table"}}

    <PageHeading>Table</PageHeading>

    <div class="gap-y-3 grid">

      <h2>Normal Table</h2>
      <Table
        @hover={{this.hover}}
        @last={{this.last}}
        @striped={{this.striped}}
        as |t|
      >
        <t.thead>
          <t.trh><t.th @light={{this.light}}>one</t.th><t.th
              @light={{this.light}}
            >two</t.th></t.trh>
        </t.thead>
        <tbody>
          {{#each VALUES as |vals|}}
            <t.tr>
              {{#each vals as |v|}}
                <t.td>{{v}}</t.td>
              {{/each}}
            </t.tr>
          {{/each}}
        </tbody>
      </Table>

      <h2>Selectable Table</h2>
      <SelectableTable @last={{this.last}} as |t|>
        <t.thead>
          <t.trh><t.th @light={{this.light}}>one</t.th><t.th
              @light={{this.light}}
            >two</t.th></t.trh>
        </t.thead>
        <tbody>
          {{#each VALUES as |vals i|}}
            <t.tr
              @onClick={{fn (this.setSelected i)}}
              @active={{eq i this.active}}
              @selected={{eq i this.selected}}
              @selectable={{true}}
            >
              {{#each vals as |v|}}
                <t.td>{{v}}</t.td>
              {{/each}}
            </t.tr>
          {{/each}}
        </tbody>
      </SelectableTable>

      <div><button
          class="btn btn-default"
          type="button"
          {{on "click" this.setActive}}
        >confirm</button></div>

      <h2>Multi Selectable Table</h2>
      <SelectableTable @last={{this.last}} as |t|>
        <t.thead>
          <t.trh><t.th @light={{this.light}}>one</t.th><t.th
              @light={{this.light}}
            >two</t.th></t.trh>
        </t.thead>
        <tbody>

          {{#each VALUES as |vals i|}}
            <t.tr
              @onClick={{fn (this.toggleSelection i)}}
              @selected={{this.isSelected i}}
              @selectable={{true}}
            >
              {{#each vals as |v|}}
                <t.td>{{v}}</t.td>
              {{/each}}
            </t.tr>
          {{/each}}
        </tbody>
      </SelectableTable>
      <div class="flex gap-2">
        <Checkbox
          @label="striped"
          @checked={{this.striped}}
          @onChange={{fn (mut this.striped)}}
        />
        <Checkbox
          @label="hover"
          @checked={{this.hover}}
          @onChange={{fn (mut this.hover)}}
        />
        <Checkbox
          @label="last"
          @checked={{this.last}}
          @onChange={{fn (mut this.last)}}
        />
        <Checkbox
          @label="light"
          @checked={{this.light}}
          @onChange={{fn (mut this.light)}}
        />
      </div>
    </div>
  </template>
}
