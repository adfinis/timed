/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { action } from "@ember/object";
import Component from "@glimmer/component";
import { DateTime } from "luxon";

/**
 * The date navigation component
 *
 * @public
 */
export default class DateNavigationComponent extends Component {
  /**
   * Set the current date to today
   *
   * @method setToday
   * @public
   */
  @action
  setToday() {
    const today = DateTime.now().startOf("day");
    this.args.onChange(today);
  }
  /**
   * Decrease the current date by one day
   *
   * @method setPrevious
   * @public
   */
  @action
  setPrevious() {
    const date = this.args.current.minus({ days: 1 });

    this.args.onChange(date);
  }

  /**
   * Increase the current date by one day
   *
   * @method setNext
   * @public
   */
  @action
  setNext() {
    const date = this.args.current.plus({ days: 1 });

    this.args.onChange(date);
  }
}
