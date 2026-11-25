import Component from "@glimmer/component";
import style from "ember-style-modifier";
import { cached } from "tracked-toolbox";

import formatDuration from "timed/helpers/format-duration";

const { floor, min, abs } = Math;

const { isInteger } = Number;

const RADIUS = 100 / (2 * Math.PI);

const STATUS_CLASSES = {
  ok: {
    current: "stroke-success",
    planned: "stroke-success/40 text-success/70",
  },
  warning: {
    current: "stroke-warning",
    planned: "stroke-warning/40 text-warning/70",
  },
  danger: {
    current: "stroke-danger",
    planned: "stroke-danger/40 text-danger/70",
  },
};

const dasharray = (value) => {
  value = Math.min(value, 1);
  return `${value * 100} ${(1 - value) * 100}`;
};

class BalanceDonutComponent extends Component {
  get balance() {
    return this.args.balance;
  }

  get endOfYear() {
    return this.args.endOfYearBalance;
  }

  get hasPlannedDays() {
    if (!this.balance.isHoliday) return false;
    return this.plannedDays > 0;
  }

  get pastDays() {
    return this.balance.usedDays;
  }

  get totalDaysEOY() {
    return this.endOfYear.usedDays;
  }

  get plannedDays() {
    return this.totalDaysEOY - this.pastDays;
  }

  get value() {
    if (!this.balance.isHoliday) return 1;

    return abs(this.pastDays / this.balance.credit);
  }

  get plannedValue() {
    if (!this.hasPlannedDays) return undefined;
    return this.totalDaysEOY / this.endOfYear.credit;
  }

  get status() {
    if (!this.balance.isHoliday) return undefined;
    if (this.totalDaysEOY > this.endOfYear.credit) return "danger";
    if (this.totalDaysEOY === this.endOfYear.credit) return "warning";
    return "ok";
  }

  get classes() {
    if (this.balance.isDuration) return { current: "stroke-primary" };
    if (!this.balance.isHoliday) return { current: "stroke-warning" };

    return STATUS_CLASSES[this.status];
  }

  @cached
  get style() {
    const mean = this.args.count / 2;

    const median = [floor(mean), ...(isInteger(mean) ? [floor(mean - 1)] : [])];

    const deviation = min(...median.map((m) => abs(m - this.args.index)));

    const offset =
      deviation && (1 / (floor(mean) - (isInteger(mean) ? 1 : 0))) * deviation;

    return { "--offset-multiplicator": offset.toString() };
  }
  <template>
    <div
      ...attributes
      {{style this.style}}
      data-test-balance-type={{@balance.type}}
      data-test-status={{this.status}}
      class="{{@class}}
        balance-donut
        {{this.strokeClass}}
        text-foreground/85 relative translate-y-[calc(var(--max-offset)*var(--offset-multiplicator))] transition-all md:basis-32 lg:[--max-offset:-0.25rem]"
    >
      <div
        class="donut-title whitespace-nowrap text-center text-3xl md:text-2xl"
      >
        {{@title}}
      </div>

      <div class="donut relative">
        <svg width="100%" height="100%" viewBox="0 0 40 40">
          <circle
            class="donut-ring stroke-background-muted"
            cx="20"
            cy="20"
            r={{RADIUS}}
            fill="transparent"
            stroke-width="2"
          ></circle>

          {{#if this.hasPlannedDays}}
            <circle
              data-test-planned-segment
              class="donut-segment {{this.classes.planned}}"
              cx="20"
              cy="20"
              r={{RADIUS}}
              fill="transparent"
              stroke-width="2"
              stroke-dasharray="{{dasharray this.plannedValue}}"
              stroke-dashoffset="25"
            ></circle>
          {{/if}}

          <circle
            data-test-past-segment
            class="donut-segment {{this.classes.current}}"
            cx="20"
            cy="20"
            r={{RADIUS}}
            fill="transparent"
            stroke-width="2"
            stroke-dasharray="{{dasharray this.value}}"
            stroke-dashoffset="25"
          ></circle>

        </svg>

        <div
          class="donut-content absolute inset-0 flex h-full w-full flex-col items-center justify-center p-4 text-center text-2xl md:text-xl"
        >
          {{#if @balance.isDuration}}
            {{formatDuration @balance.usedDuration false}}
          {{else}}
            {{#if @balance.isHoliday}}
              <div data-test-holiday-main-text>{{@balance.usedDays}}<span
                  class="text-foreground-muted"
                > / </span>{{@balance.credit}}</div>
              {{#if this.hasPlannedDays}}
                <div
                  data-test-holiday-subtext
                  class="{{this.classes.planned}}
                    -mt-1 text-sm font-medium md:text-xs"
                >+{{this.plannedDays}}
                  Planned</div>
              {{/if}}
            {{else}}
              {{@balance.usedDays}}
            {{/if}}
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}

export default BalanceDonutComponent;
