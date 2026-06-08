/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { on } from "@ember/modifier";
import { action } from "@ember/object";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { DateTime } from "luxon";

/**
 * The date navigation component
 *
 * @public
 */
import DatepickerButton from "timed/components/datepicker-button";
import MagicLinkBtn from "timed/components/magic-link-btn";

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
  <template>
    <div class="flex h-full flex-row justify-between" ...attributes>
      <div><MagicLinkBtn class="h-full" /></div>
      <div class="btn-group mx-6 flex h-full flex-row">
        <button
          type="button"
          data-test-previous
          title="Previous day"
          class="btn btn-default h-full"
          {{on "click" this.setPrevious}}
        >
          <FaIcon @icon="arrow-left" @prefix="fas" />
        </button>
        <button
          type="button"
          data-test-today
          title="Today"
          class="btn btn-default"
          {{on "click" this.setToday}}
        >
          Today
        </button>
        <button
          type="button"
          data-test-next
          title="Next day"
          class="btn btn-default h-full"
          {{on "click" this.setNext}}
        >
          <FaIcon @icon="arrow-right" @prefix="fas" />
        </button>
      </div>

      <DatepickerButton
        class="h-full"
        @value={{@current}}
        @onChange={{@onChange}}
      />
    </div>
  </template>
}
