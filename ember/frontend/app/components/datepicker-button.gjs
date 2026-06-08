/**
 * @module timed
 * @submodule timed-components
 * @public
 */

import { action } from "@ember/object";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import BasicDropdown from "ember-basic-dropdown/components/basic-dropdown";
import { localCopy } from "tracked-toolbox";

import Calendar from "timed/components/calendar";
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
  updateCenter({ datetime }) {
    this.center = datetime;
  }

  @action
  updateSelection({ datetime }) {
    this.args.onChange(datetime);
  }
  <template>
    <BasicDropdown @horizontalPosition="auto-right" as |dd|>
      <dd.Trigger>
        <button class="btn btn-default" type="button" ...attributes>
          <FaIcon @icon="calendar" />
        </button>
      </dd.Trigger>
      <dd.Content class="!p-0">
        <Calendar
          class="datepicker"
          @center={{this.center}}
          @selected={{@value}}
          @onCenterChange={{this.updateCenter}}
          @onSelect={{this.updateSelection}}
        />
      </dd.Content>
    </BasicDropdown>
  </template>
}
