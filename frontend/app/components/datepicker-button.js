/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { action } from "@ember/object";
import { localCopy } from "tracked-toolbox";

import Datepicker from "timed/components/datepicker";

/**
 * The datepicker button component
 *
 * @class DatepickerButton
 * @extends Datepicker
 * @public
 */
export default class DatepickerButtonComponent extends Datepicker {
  @localCopy("args.current") center;

  @action
  updateCenter({ moment }) {
    this.center = moment;
  }

  @action
  updateSelection({ moment }) {
    this.args.onChange(moment);
  }
}
