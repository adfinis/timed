import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import PowerCalendar from "ember-power-calendar/components/power-calendar";
import { eq } from "ember-truth-helpers";
import { DateTime, Info } from "luxon";
import { CardBlock, CardFooter, CardHeader } from "ui-core/components/ui-card";

import luxonFormat from "timed/helpers/luxon-format";

const CURRENT_YEAR = DateTime.now().year;

const YEARS_IN_FUTURE = 5;

export default class Calendar extends Component {
  _months = Info.months();

  years = [...new Array(40).keys()].map(
    (i) => `${CURRENT_YEAR + YEARS_IN_FUTURE - i}`,
  );

  get months() {
    return this._months.map((label, idx) => ({ label, n: idx + 1 }));
  }

  fromJSDate(date) {
    return DateTime.fromJSDate(date);
  }

  @action
  changeCenter(unit, calendar, e) {
    const newCenter = DateTime.fromJSDate(calendar.center).set({
      [unit]: parseInt(e.target.value),
    });
    calendar.actions.changeCenter(newCenter.toJSDate());
  }
  <template>
    <PowerCalendar
      ...attributes
      class="calendar [--size:2rem] md:[--size:2.1rem]"
      @onSelect={{@onSelect}}
      @selected={{@selected}}
      @center={{@center}}
      @onCenterChange={{@onCenterChange}}
      as |calendar|
    >
      <CardHeader class="!px-2 !py-0.5">
        <calendar.Nav>
          {{#let (this.fromJSDate calendar.center) as |center|}}
            <span class="nav-select-month relative">
              {{luxonFormat center "MMMM"}}
              <select
                aria-label="Month"
                class="absolute inset-0 opacity-0"
                {{on "change" (fn this.changeCenter "month" calendar)}}
              >
                {{#each this.months as |month|}}
                  <option
                    value={{month.n}}
                    selected={{eq month.n center.month}}
                    data-test-month={{month.label}}
                  >{{month.label}}</option>
                {{/each}}
              </select>
            </span>
            <span class="nav-select-year relative">
              {{#let (luxonFormat center "yyyy") as |currentYear|}}
                {{currentYear}}
                <select
                  aria-label="Year"
                  class="absolute inset-0 opacity-0"
                  {{on "change" (fn this.changeCenter "year" calendar)}}
                >
                  {{#each this.years as |year|}}
                    <option
                      value={{year}}
                      data-test-year={{year}}
                      selected={{eq year currentYear}}
                    >{{year}}</option>
                  {{/each}}
                </select>
              {{/let}}
            </span>
          {{/let}}
        </calendar.Nav>
      </CardHeader>
      <CardBlock class="!p-2"><calendar.Days @startOfWeek="1" /></CardBlock>
      <CardFooter />
    </PowerCalendar>
  </template>
}
