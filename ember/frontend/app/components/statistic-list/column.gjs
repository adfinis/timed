import Component from "@glimmer/component";
import { DateTime } from "luxon";
import Td from "timed/components/table/td";
import eq from "ember-truth-helpers/helpers/eq";
import humanizeDuration from "timed/helpers/humanize-duration";
import luxonFormat from "timed/helpers/luxon-format";

export default class StatisticListColumn extends Component {
  dateTimeForMonth(month) {
    return DateTime.fromObject({ month });
  }
<template><Td ...attributes>
  {{#if (eq @layout "DURATION")}}
    {{humanizeDuration @value false}}
  {{else if (eq @layout "MONTH")}}
    {{luxonFormat (this.dateTimeForMonth @value) "MMMM"}}
  {{else}}
    {{@value}}
  {{/if}}
</Td></template>}
