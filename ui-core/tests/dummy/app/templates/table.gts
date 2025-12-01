import Component from "@glimmer/component";
import Table from "ui-core/components/table";
import pageTitle from "ember-page-title/helpers/page-title";
import { tracked } from "@glimmer/tracking";
import Checkbox from "ui-core/components/checkbox";
import { fn } from "@ember/helper";

const VALUES = [
  ["foo", "bar"],
  ["baz", "abc"],
  ["deadbeef", "12345"],
];

export default class TableTemplate extends Component {
  @tracked striped = true;
  @tracked hover = false;
  @tracked last = false;
  @tracked light = false;

  <template>
    {{pageTitle "Table"}}

    <h2>Table</h2>

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

    <div class="flex gap-2 mt-2">
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
  </template>
}
