import { SelectableTable } from "#src/components/table.gts";
import {
  durationAsString,
  parseDurationFromString,
} from "#src/utils/duration.ts";
import { fn } from "@ember/helper";
import { get } from "@ember/helper";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { eq } from "ember-truth-helpers";
import { Duration } from "luxon";
import Layout from "../components/layout.gts";

const FIELDS = [
  "user",
  "duration",
  "customer",
  "project",
  "task",
  "date",
  "comment",
] as const;

interface Report {
  user: string;
  duration: string;
  customer: string;
  project: string;
  task: string;
  date: string;
  comment: string;
  id: number;
}

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

const USERS = ["maxm", "fritzm", "janed", "jasminem"];
const CUSTOMERS = ["cust 1", "cust 2"];
const PROJECTS = ["big project", "small project"];
const TASKS = ["maintenance", "technical work", "support"];
const DURATIONS = [
  "00:15",
  "00:30",
  "00:45",
  "01:00",
  "01:15",
  "02:15",
  "03:00",
];
const COMMENTS = [
  "lorem ipsum",
  "did a thing",
  "did two things",
  "fixed a bug",
  "fixed two bugs",
  "idling",
];
const DATES = Array(20)
  .fill(0)
  .map((_, i) =>
    new Date(2026, i, rand([1, 2, 3, 4, 5])).toISOString().slice(0, 10),
  );

let cnt = 0;

const genReport = (): Report => {
  cnt++;

  return {
    task: rand(TASKS),
    customer: rand(CUSTOMERS),
    project: rand(PROJECTS),
    user: rand(USERS),
    duration: rand(DURATIONS),
    comment: rand(COMMENTS),
    date: rand(DATES),
    id: cnt,
  };
};

const reports = Array(50)
  .fill(0)
  .map(() => genReport());

export default class AnalysisTemplate extends Component {
  @tracked selected = [] as number[];

  toggle = (id: number) => {
    if (this.selected.includes(id)) {
      this.selected = this.selected.filter((v) => v != id);
      return;
    }
    this.selected = [...this.selected, id];
  };

  isSelected = (id: number) => {
    return this.selected.includes(id);
  };

  get total() {
    return reports.reduce(
      (acc, val) => acc.plus(parseDurationFromString(val.duration)),
      Duration.fromMillis(0),
    );
  }

  <template>
    <Layout>
      <:header>
        <h1>Analysis</h1>
        <SelectableTable as |t|>
          <t.tbody class="collapse">
            {{#each reports as |r|}}
              <t.trh>{{#each FIELDS as |f|}}<t.td>{{get
                      r
                      f
                    }}</t.td>{{/each}}</t.trh>
            {{/each}}
          </t.tbody>
          <t.thead>
            <t.trh>
              {{#each FIELDS as |field|}}
                <t.th>{{field}}</t.th>
              {{/each}}
            </t.trh>
          </t.thead>
        </SelectableTable>
      </:header>

      <:main>
        <SelectableTable
          role="grid"
          aria-multiselectable="true"
          @last={{true}}
          as |t|
        >
          <t.thead class="collapse">
            <t.trh>
              {{#each FIELDS as |field|}}
                <t.th>{{field}}</t.th>
              {{/each}}
            </t.trh>
          </t.thead>
          <t.tbody>
            {{#each reports as |r|}}
              <t.tr
                @onChange={{fn this.toggle r.id}}
                @selectable={{eq r.user "fritzm"}}
                @selected={{this.isSelected r.id}}
              >
                {{#each FIELDS as |field|}}
                  <t.td>{{get r field}}</t.td>
                {{/each}}
              </t.tr>
            {{/each}}
          </t.tbody>

        </SelectableTable>
      </:main>

      <:footer>
        <SelectableTable as |t|>

          <t.tfoot>
            <t.trh>
              <t.th>total:</t.th>
              <t.th colspan="67" class="font-semibold">{{durationAsString
                  this.total
                }}</t.th>
            </t.trh>
          </t.tfoot>
          <t.tbody class="collapse">
            {{#each reports as |r|}}
              <t.trh>{{#each FIELDS as |f|}}<t.td>{{get
                      r
                      f
                    }}</t.td>{{/each}}</t.trh>
            {{/each}}
          </t.tbody>
        </SelectableTable>
      </:footer>
    </Layout>
  </template>
}
