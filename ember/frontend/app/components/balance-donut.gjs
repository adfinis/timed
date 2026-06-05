import Component from "@glimmer/component";
import { cached } from "tracked-toolbox";
import style_ from "ember-style-modifier/modifiers/style";
import mult from "ember-math-helpers/helpers/mult";
import min0 from "ember-math-helpers/helpers/min";
import sub_ from "ember-math-helpers/helpers/sub";
import formatDuration from "timed/helpers/format-duration";
import gte from "ember-truth-helpers/helpers/gte";
import round from "ember-math-helpers/helpers/round";

const { PI, floor, min, abs } = Math;

const { isInteger } = Number;
class BalanceDonutComponent extends Component {
  get value() {
    if (this.args.balance.usedDuration || !this.args.balance.credit) {
      return 1;
    }

    return abs(this.args.balance.usedDays / this.args.balance.credit);
  }

  get strokeClass() {
    if (this.args.balance.usedDuration) {
      return "stroke-primary";
    }

    if (this.value > 1 || this.value < 0) {
      return "stroke-danger";
    }

    if (this.value === 1) {
      return "stroke-warning";
    }

    return "stroke-success";
  }

  radius = 100 / (2 * PI);

  @cached
  get style() {
    const mean = this.args.count / 2;

    const median = [floor(mean), ...(isInteger(mean) ? [floor(mean - 1)] : [])];

    const deviation = min(...median.map((m) => abs(m - this.args.index)));

    const offset =
      deviation && (1 / (floor(mean) - (isInteger(mean) ? 1 : 0))) * deviation;

    return { "--offset-multiplicator": offset.toString() };
  }
<template><div {{style_ this.style}} class="{{@class}}
    balance-donut
    {{this.strokeClass}}
    text-foreground/85 relative translate-y-[calc(var(--max-offset)*var(--offset-multiplicator))] transition-all md:basis-32 lg:[--max-offset:-0.25rem]">
  <div class="donut-title whitespace-nowrap text-center text-3xl md:text-2xl">
    {{@title}}
  </div>

  <div class="donut relative">
    <svg width="100%" height="100%" viewBox="0 0 40 40">
      <circle class="donut-ring stroke-background-muted" cx="20" cy="20" r={{this.radius}} fill="transparent" stroke-width="2"></circle>

      <circle class="donut-segment" cx="20" cy="20" r={{this.radius}} fill="transparent" stroke-width="2" stroke-dasharray="{{mult (min0 this.value 1) 100}} {{mult (sub_ 1 (min0 this.value 1)) 100}}" stroke-dashoffset="25"></circle>
    </svg>

    <div class="donut-content absolute inset-0 flex h-full w-full flex-col items-center justify-center p-4 text-center text-2xl md:text-xl">
      {{#if @balance.usedDuration}}
        {{formatDuration @balance.usedDuration false}}
      {{else}}
        {{#if @balance.credit}}
          <div class="text-foreground-muted text-base md:text-sm">{{@balance.usedDays}}
            of
            {{@balance.credit}}</div>
          {{#if (gte @balance.credit 1)}}
            <div>{{round (mult this.value 100)}}%</div>
          {{/if}}
        {{else}}
          {{@balance.usedDays}}
        {{/if}}
      {{/if}}
    </div>
  </div>
</div></template>}

export default BalanceDonutComponent;
