import { on } from "@ember/modifier";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import { DateTime } from "luxon";

/**
 * Timepicker component
 *
 * @public
 */
export default class TimepickerComponent extends Component {
  sanitize(value) {
    return value.replace(/[^\d:]/, "");
  }

  get value() {
    return this.args.value ?? DateTime.now();
  }

  get max() {
    return this.args.max ?? this.value.endOf("day");
  }

  get min() {
    return this.args.min ?? this.value.startOf("day");
  }

  /**
   * The input placeholder
   *
   * @property {string} placeholder
   * @public
   */
  get placeholder() {
    return this.args.placeholder ?? "00:00";
  }

  /**
   * The maximal length of the value
   *
   * @property {number} maxlength
   * @public
   */
  get maxlength() {
    return this.args.maxLength ?? 5;
  }

  /**
   * The precision of the time
   *
   * 60 needs to be divisible by this
   *
   * @property {number} precision
   * @public
   */
  get precision() {
    return this.args.precision ?? 15;
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

    return `([01]?[0-9]|2[0-3]):(${minutes
      .map((m) => String(m).padStart(2, "0"))
      .join("|")})`;
  }

  /**
   * The display representation of the value
   *
   * This is the value in the input field.
   *
   * @property {string} displayValue
   * @public
   */
  get displayValue() {
    return this.args.value && this.args.value.isValid
      ? this.args.value.toFormat("HH:mm")
      : "";
  }

  /**
   * Handle input event
   *
   * @event change
   * @param {Event} e The change event
   * @public
   */
  @action
  change(e) {
    if (e.target.validity.valid) {
      const [h = NaN, m = NaN] = this.sanitize(e.target.value)
        .split(":")
        .map((n) => parseInt(n));

      this._change([h, m].some(isNaN) ? null : this._set(h, m));
    }
  }

  /**
   * Handle keydown event
   *
   * @event keyDown
   * @param {jQuery.Event} e The jquery input event
   * @return {Boolean} Whether to bubble the event or not
   * @public
   */
  @action
  keyDown(e) {
    this._handleArrows(e);

    return true;
  }

  /**
   * Set the current value
   *
   * @param {number} h The hours of the new value
   * @param {number} m The minutes of the new value
   * @return {DateTime} The mutated value
   * @private
   */
  _set(hours, minutes) {
    return (this.value || this.min).set({ hours, minutes });
  }

  /**
   * Add hours and minutes to a value
   *
   * @param {number} hours The hours to add
   * @param {number} minutes The minutes to add
   * @return {DateTime} The mutated value
   * @private
   */
  _add(hours, minutes) {
    let base = this.value;

    if (!this.args.value) {
      base = [hours, minutes].filter((n) => n < 0).length
        ? this.max.plus({ minutes: 1 })
        : this.min;
    }

    return base.plus({ hours, minutes });
  }

  /**
   * Get the validity status of a value
   *
   * @param {DateTime} value The value to check
   * @return {boolean} Whether the value is valid
   * @private
   */
  _isValid(value) {
    // we compare milliseconds, as some libraries recklessly proxy things in a way that breaks comparing objects
    return (
      value.toMillis() < this.max.toMillis() &&
      value.toMillis() > this.min.toMillis()
    );
  }

  /**
   * Add minutes to the current value
   *
   * @param {number} minutes The amount of minutes to add
   * @private
   */
  _addMinutes(minutes) {
    const newValue = this._add(0, minutes);

    if (this._isValid(newValue)) {
      this._change(newValue);
    }
  }

  /**
   * Add hours to the current value
   *
   * @param {number} hours The amount of hours to add
   * @private
   */
  _addHours(hours) {
    const newValue = this._add(hours, 0);

    if (this._isValid(newValue)) {
      this._change(newValue);
    }
  }

  /**
   * Ensure that the new value is valid and trigger a change
   *
   * @param {DateTime} value The new value
   * @private
   */
  _change(value) {
    this.args.onChange(value);
  }

  /**
   * Increase or decrease the current value
   *
   * If the shift or ctrl key is pressed it changes the hours instead of the
   * minutes.
   *
   * @method _handleArrows
   * @param {jQuery.Event} e The keydown event
   * @private
   */
  _handleArrows(e) {
    switch (e.keyCode) {
      case 38:
        if (e.ctrlKey || e.shiftKey) {
          this._addHours(1);
        } else {
          this._addMinutes(this.precision);
        }
        break;
      case 40:
        if (e.ctrlKey || e.shiftKey) {
          this._addHours(-1);
        } else {
          this._addMinutes(-this.precision);
        }
        break;
    }
  }
  <template>
    <input
      aria-label="time picker"
      type="text"
      class="form-control rounded"
      pattern={{this.pattern}}
      value={{this.displayValue}}
      maxlength={{this.maxlength}}
      placeholder={{this.placeholder}}
      autocomplete="off"
      {{on "keydown" this.keyDown}}
      {{on "change" this.change}}
      {{on "focusout" (optional @onFocusOut)}}
    />
  </template>
}
