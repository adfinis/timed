import Component from "@glimmer/component";
import Table, { Thead, Th, Td, Tr } from "ui-core/components/table";
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

    <h1>Table</h1>

    <Table>
      <Thead>
        <Tr><Th @light={{this.light}}>one</Th><Th
            @light={{this.light}}
          >two</Th></Tr>
      </Thead>
      <tbody>
        {{#each VALUES as |vals|}}
          <Tr
            @striped={{this.striped}}
            @hover={{this.hover}}
            @last={{this.last}}
          >
            {{#each vals as |v|}}
              <Td>{{v}}</Td>
            {{/each}}
          </Tr>
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
