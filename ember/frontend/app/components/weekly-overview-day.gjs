import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import or from "ember-truth-helpers/helpers/or";
import and from "ember-truth-helpers/helpers/and";
import not from "ember-truth-helpers/helpers/not";
import { on } from "@ember/modifier";
import style_ from "ember-style-modifier/modifiers/style";
import luxonFormat from "timed/helpers/luxon-format";
export default class WeeklyOverviewDay extends Component {
  /**
   * Maximum worktime in hours
   *
   * @property {Number} max
   * @public
   */
  @tracked max = 20;

  get title() {
    const pre = this.args.prefix?.length ? `${this.args.prefix}, ` : "";

    let title = `${this.args.worktime.hours}h`;

    if (this.args.worktime.minutes) {
      title += ` ${this.args.worktime.minutes}m`;
    }
    return `${pre}${title}`;
  }

  get formattedWeekday() {
    return this.args.day.toFormat("EEE").slice(0, 2);
  }

  get style() {
    const height = Math.min(
      (this.args.worktime.as("hours") / this.max) * 100,
      100,
    );
    return { height: `${height}%` };
  }

  @action
  click(event) {
    const action = this.args.onClick;

    if (action) {
      event.preventDefault();

      this.args.onClick(this.args.day);
    }
  }
<template><button title={{this.title}} type="button" {{on "click" this.click}} {{style_ this.style}} class="weekly-overview-day relative z-10 h-0 w-4 cursor-pointer [&>*]:transition-colors
    {{if @active "active"}}
    {{if @absence "absence"}}
    {{if @holiday "holiday"}}
    {{unless @workday "weekend"}}
    {{if @absence "text-overview-absence hover:text-overview-absence-hf focus:text-overview-absence-hf [&.active]:text-overview-absence-active" (or (if (and @workday (not @holiday)) "text-overview-workday hover:text-overview-workday-hf focus:text-overview-workday-hf [&.active]:text-overview-workday-active") "text-overview-weekend hover:text-overview-weekend-hf focus:text-overview-weekend-hf [&.active]:text-overview-weekend-active")}}
    " ...attributes>
  <div class="bar h-full w-full bg-current"></div>
  <div class="day absolute -bottom-[2.5em] left-1/2 -translate-x-1/2 text-center text-sm font-medium leading-4">
    {{luxonFormat @day "dd"}}
    {{this.formattedWeekday}}
  </div>
</button></template>}
