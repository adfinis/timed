import { action } from "@ember/object";
import { Duration } from "luxon";
import DurationpickerComponent from "timed/components/durationpicker";
import parseDayTime from "timed/utils/parse-daytime";
import { on } from "@ember/modifier";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";

export default class DurationpickerDayComponent extends DurationpickerComponent {
  maxlength = 5;

  max = Duration.fromObject({ hours: 24 });

  min = Duration.fromMillis(0);

  sanitize(value) {
    return value.replace(/[^\d:]/, "");
  }

  get pattern() {
    return "^(?:[01]?\\d|2[0-3])?:?(?:00|15|30|45)?$";
  }

  @action
  change({ target: { validity, value } }) {
    if (validity.valid) {
      const [h, m] = parseDayTime(value);
      this._change(this._set(h, m));
    }
  }
<template><input ...attributes aria-label="day picker" name="duration-day" type="text" class="duration-day form-control rounded" disabled={{@disabled}} pattern={{this.pattern}} value={{this.displayValue}} maxlength={{this.maxlength}} placeholder={{this.placeholder}} autocomplete="off" title={{@title}} {{on "change" this.change}} {{on "keyup" this.handleKeyPress}} {{on "focusout" (optional @onFocusOut)}} /></template>}
