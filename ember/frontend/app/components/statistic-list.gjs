import { get as get0 } from "@ember/helper";
import { get } from "@ember/object";
import { capitalize } from "@ember/string";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import VerticalCollection from "@html-next/vertical-collection/components/vertical-collection/component";
import slice from "@nullvoxpopuli/ember-composable-helpers/helpers/slice";
import add from "ember-math-helpers/helpers/add";
import div_ from "ember-math-helpers/helpers/div";
import eq from "ember-truth-helpers/helpers/eq";
import gt from "ember-truth-helpers/helpers/gt";
import not from "ember-truth-helpers/helpers/not";
import or from "ember-truth-helpers/helpers/or";
import { Duration } from "luxon";

import Empty from "timed/components/empty";
import LoadingIcon from "timed/components/loading-icon";
import SortHeader from "timed/components/sort-header";
import Bar from "timed/components/statistic-list/bar";
import Column from "timed/components/statistic-list/column";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Tfoot from "timed/components/table/tfoot";
import Th from "timed/components/table/th";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import humanizeDuration from "timed/helpers/humanize-duration";
import parseDjangoDuration from "timed/utils/parse-django-duration";

const PLAIN_LAYOUT = "PLAIN";
const DURATION_LAYOUT = "DURATION";
const MONTH_LAYOUT = "MONTH";
const ZERO_DURATION = Duration.fromMillis(0);

const COLUMN_MAP = {
  year: [
    { title: "Year", path: "year", layout: PLAIN_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  month: [
    { title: "Year", path: "year", layout: PLAIN_LAYOUT },
    { title: "Month", path: "month", layout: MONTH_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  customer: [
    { title: "Customer", path: "name", layout: PLAIN_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  project: [
    { title: "Customer", path: "customer.name", layout: PLAIN_LAYOUT },
    { title: "Project", path: "name", layout: PLAIN_LAYOUT },
    {
      title: "Estimated",
      path: "estimatedTime",
      layout: DURATION_LAYOUT,
    },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
    {
      title: "Remaining Effort",
      path: "totalRemainingEffort",
      layout: DURATION_LAYOUT,
    },
  ],
  task: [
    {
      title: "Customer",
      path: "project.customer.name",
      layout: PLAIN_LAYOUT,
    },
    { title: "Project", path: "project.name", layout: PLAIN_LAYOUT },
    { title: "Task", path: "name", layout: PLAIN_LAYOUT },
    { title: "Estimated", path: "estimatedTime", layout: DURATION_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
    {
      title: "Remaining Effort",
      path: "mostRecentRemainingEffort",
      layout: DURATION_LAYOUT,
    },
  ],
  user: [
    {
      title: "User",
      path: "user.fullName",
      ordering: "user__username",
      layout: PLAIN_LAYOUT,
    },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
};

export default class StatisticList extends Component {
  get value() {
    return this.args.data?.last?.value;
  }

  get maxDuration() {
    /* istanbul ignore if*/
    if (!this.value) {
      return null;
    }

    const maxEstimated = Math.max(
      0,
      ...this.value.map((v) => (v.estimatedTime ?? ZERO_DURATION).toMillis()),
    );
    const maxDurationWithRemainingEffort = Math.max(
      0,
      ...this.value.map((row) =>
        (row.duration ?? ZERO_DURATION)
          .plus(row.mostRecentRemainingEffort ?? ZERO_DURATION)
          .toMillis(),
      ),
    );

    return Math.max(maxEstimated, maxDurationWithRemainingEffort);
  }

  get totalDuration() {
    return parseDjangoDuration(this.value.meta?.["total-time"] ?? null);
  }

  get totalEstimatedTime() {
    return parseDjangoDuration(
      this.value.meta?.["total-estimated-time"] ?? null,
    );
  }

  get totalRemainingEfforts() {
    return parseDjangoDuration(
      this.value.meta?.["total-remaining-effort"] ?? null,
    );
  }

  get columns() {
    return get(COLUMN_MAP, this.args.type).map((col) => ({
      ...col,
      ordering: col.ordering || col.path.replace(/\./g, "__"),
    }));
  }

  get missingParamsMessage() {
    if (!this.args.missingParams?.length) {
      return "";
    }

    const text = this.args.missingParams
      .map((param, index) => {
        if (index === 0) {
          param = capitalize(param);
        }

        if (this.args.missingParams.length > 1) {
          if (index + 1 === this.args.missingParams.length) {
            param = `and ${param}`;
          } else if (index + 2 !== this.args.missingParams.length) {
            param = `${param},`;
          }
        }

        return param;
      })
      .join(" ");

    const suffix =
      this.args.missingParams.length > 1
        ? "are required parameters"
        : "is a required parameter";

    return `${text} ${suffix} for this statistic`;
  }
  <template>
    <div ...attributes>
      {{#if @data.isRunning}}
        <Empty data-test-loading>
          <LoadingIcon />
        </Empty>
      {{else if @data.last.isError}}
        <Empty data-test-something-went-wrong>
          <div>
            <FaIcon @icon="bolt" @prefix="fas" />
            <h3>Oops... Something went wrong</h3>
            <p>
              Have you tried turning it off and on again?
              <br />
              Please try refreshing the page.
            </p>
          </div>
        </Empty>
      {{else if @missingParams}}
        <Empty data-test-missing-filter-params>
          <FaIcon @icon="magnifying-glass" @prefix="fas" />
          <h3>Missing filter parameters</h3>
          <p>{{this.missingParamsMessage}}</p>
        </Empty>
      {{else if (not @data.last.value)}}
        <Empty>
          <FaIcon @icon="chart-bar" />
          <h3>No statistics to display</h3>
          <p>Maybe try loosening your filters</p>
        </Empty>
      {{else}}
        <Table class="table-striped table--statistics table">
          <Thead>
            <Tr>
              {{#each this.columns as |column|}}
                {{#if column.ordering}}
                  <SortHeader
                    @current={{@ordering}}
                    @update={{@onOrderingChange}}
                    @by={{column.ordering}}
                  >
                    {{column.title}}
                  </SortHeader>
                {{else}}
                  <Th @light={{true}}>{{column.title}}</Th>
                {{/if}}
              {{/each}}
              <th class="max-sm:hidden"></th>
            </Tr>
          </Thead>
          <VerticalCollection
            @items={{slice @data.last.value}}
            @tagName="tbody"
            @estimateHeight={{40}}
            @staticHeight={{true}}
            @bufferSize={{10}}
            @containerSelector=".page-content--scroll"
            as |row|
          >
            <Tr
              @striped={{true}}
              data-test-statistic-list-row
              class="[&>*]:leading-5"
            >
              {{#each this.columns as |column|}}
                <Column
                  data-test-statistic-list-column
                  @layout={{column.layout}}
                  @value={{get0 row column.path}}
                />
              {{/each}}
              <Td class="w-1/2 max-sm:hidden">
                {{#let
                  (or row.totalRemainingEffort row.mostRecentRemainingEffort)
                  as |remainingEffort|
                }}
                  {{#let
                    (if
                      (gt remainingEffort 0)
                      (add row.duration remainingEffort)
                      0
                    )
                    as |allotted|
                  }}
                    <Bar
                      @value={{div_ row.duration this.maxDuration}}
                      @remaining={{div_ allotted this.maxDuration}}
                      @goal={{div_ row.estimatedTime this.maxDuration}}
                      @archived={{row.archived}}
                    />
                  {{/let}}
                {{/let}}
              </Td>
            </Tr>
          </VerticalCollection>
          <Tfoot>
            <Tr>
              {{#each this.columns as |column index|}}
                <Td>
                  <strong>
                    {{#if (not index)}}
                      Total:
                    {{else if (eq column.title "Duration")}}
                      <span class="total">{{humanizeDuration
                          this.totalDuration
                          false
                        }}</span>
                    {{else if (eq column.title "Estimated")}}
                      <span class="total">{{humanizeDuration
                          this.totalEstimatedTime
                          false
                        }}</span>
                    {{else if (eq column.title "Remaining Effort")}}
                      <span class="total">{{humanizeDuration
                          this.totalRemainingEfforts
                          false
                        }}</span>
                    {{/if}}
                  </strong>
                </Td>
              {{/each}}
              <Td class="max-sm:hidden" />
            </Tr>
          </Tfoot>
        </Table>
      {{/if}}
    </div>
  </template>
}
