import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { tracked } from "@glimmer/tracking";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import { Duration } from "luxon";
import { localCopy } from "tracked-toolbox";

import TimepickerComponent from "timed/components/timepicker";
import formatDuration from "timed/utils/format-duration";

const { MIN_SAFE_INTEGER, MAX_SAFE_INTEGER } = Number;
const { abs } = Math;

/**
 * Duration selector component
 *
 * @class DurationpickerComponent
 * @extends Ember.Component
 * @public
 */
export default class Durationpicker extends TimepickerComponent {
  maxlength = null;

  /**
   * The precision of the time
   *
   * 60 needs to be divisible by this
   *
   * @property {number} precision
   * @public
   */
  precision = 15;

  @localCopy("args.value") _value;
  @tracked elementId;

  constructor(...args) {
    super(...args);

    this.elementId = guidFor(this);
  }

  get min() {
    return this.args.min ?? MIN_SAFE_INTEGER;
  }

  get max() {
    return this.args.max ?? MAX_SAFE_INTEGER;
  }

  /**
   * The regex for the input
   *
   * @property {string} pattern
   * @public
   */
  get pattern() {
    const count = 60 / this.precision;
    const minutes = Array.from({ length: count }, (v, i) => (60 / count) * i);

    return `${this.min < 0 ? "-?" : ""}\\d+:(${minutes
      .map((m) => String(m).padStart(2, "0"))
      .join("|")})`;
  }

  /**
   * The display representation of the value
   *
   * This is the value in the input field.
   *
   * @property {String} displayValue
   * @public
   */
  get displayValue() {
    return this.value
      ? formatDuration(this.value.content ?? this.value, false)
      : "";
  }

  /**
   * Unwraps the passed value or creates a fresh duration object.
   */
  get value() {
    return this._value ?? Duration.fromMillis(0);
  }

  /**
   * Set the current value
   *
   * @method _set
   * @param {Number} hours The hours of the new value
   * @param {Number} minutes The minutes of the new value
   * @return {import('luxon').Duration} The mutated value
   * @private
   */
  _set(hours, minutes) {
    return Duration.fromObject({ hours, minutes }).rescale();
  }

  /**
   * Add hours and minutes to the current value
   *
   * @method _add
   * @param {Number} h The hours to add
   * @param {Number} m The minutes to add
   * @return {import('luxon').Duration} The mutated value
   * @private
   */
  _add(hours, minutes) {
    return this.value.plus({ hours, minutes }).rescale();
  }

  /** @param {Duration} duration */
  _isValid(duration) {
    return duration <= this.max && duration >= this.min;
  }

  @action
  change({ target: { validity, value } }) {
    if (validity.valid) {
      const negative = /^-/.test(value);

      const [h = NaN, m = NaN] = this.sanitize(value)
        .split(":")
        .map((n) => abs(parseInt(n)) * (negative ? -1 : 1));

      this._change([h, m].some(isNaN) ? null : this._set(h, m));
    }
  }

  @action
  handleKeyPress(event) {
    super.keyDown(event);
  }

  @action
  focusInput() {
    document.getElementById(this.elementId)?.focus();
  }
  <template>
    {{#if (has-block)}}
      <div
        class="form-control extendend-durationpicker-day"
        title={{@title}}
        {{!template-lint-disable no-invalid-interactive}}
        {{on "click" this.focusInput}}
      >
        {{yield}}
        <input
          ...attributes
          aria-label="duration picker"
          name="duration"
          type="text"
          class="rounded"
          id={{this.elementId}}
          title={{@title}}
          disabled={{@disabled}}
          pattern={{this.pattern}}
          value={{this.displayValue}}
          maxlength={{this.maxlength}}
          placeholder={{this.placeholder}}
          autocomplete="off"
          {{on "change" this.change}}
          {{on "keyup" this.handleKeyPress}}
          {{on "focusout" (optional @onFocusOut)}}
        />
      </div>
    {{else}}
      <input
        ...attributes
        aria-label="duration picker"
        name="duration"
        type="text"
        class="form-control rounded"
        id={{this.elementId}}
        disabled={{@disabled}}
        pattern={{this.pattern}}
        value={{this.displayValue}}
        maxlength={{this.maxlength}}
        placeholder={{this.placeholder}}
        autocomplete="off"
        title={{@title}}
        {{on "change" this.change}}
        {{on "keyup" this.handleKeyPress}}
        {{on "focusout" (optional @onFocusOut)}}
      />
    {{/if}}
  </template>
}
