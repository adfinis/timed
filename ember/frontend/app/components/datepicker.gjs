import { fn, hash } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import BasicDropdown from "ember-basic-dropdown/components/basic-dropdown";
import preventDefault from "ember-event-helpers/helpers/prevent-default";
import stopPropagation from "ember-event-helpers/helpers/stop-propagation";
import { scheduleTask } from "ember-lifeline";
import { DateTime } from "luxon";
import * as date from "ui-core/utils/date";

import Calendar from "timed/components/calendar";

export default class Datepicker extends Component {
  placeholder = date.PRETTY_FORMAT;

  @tracked center;

  constructor(...args) {
    super(...args);

    this.uniqueId = this.args.id ?? guidFor(this);
    this.center = this.args.value ?? DateTime.now();
  }

  get displayValue() {
    return this.args.value && this.args.value.isValid
      ? date.toString(this.args.value)
      : null;
  }

  @action
  handleFocus(dd) {
    if (macroCondition(isTesting())) {
      dd.actions.open();
    }
  }

  @action
  handleBlur(dd, e) {
    const container = document.getElementById(
      `ember-basic-dropdown-content-${dd.uniqueId}`,
    );

    if (!container || !container.contains(e.relatedTarget)) {
      dd.actions.close();
    }
  }

  @action
  checkValidity() {
    scheduleTask(this, "actions", this.deferredWork);
  }

  @action
  deferredWork() {
    const target = document.getElementById(this.uniqueId);

    const parsed = date.fromString(target.value);

    if (parsed && !parsed.isValid) {
      return target.setCustomValidity("Invalid date");
    }

    return target.setCustomValidity("");
  }

  @action
  handleChange({
    target: {
      value,
      validity: { valid },
    },
  }) {
    if (valid) {
      const parsed = date.fromString(value);

      return this.args.onChange(parsed && parsed.isValid ? parsed : null);
    }
  }

  @action
  updateCenter({ datetime }) {
    this.center = datetime;
  }

  @action
  updateSelect(dd, { datetime }) {
    (dd.actions.close ?? (() => {}))();
    this.args.onChange(datetime);
    this.checkValidity();
  }

  @action
  clear(dd) {
    dd.actions.close();

    this.args.onChange(null);
  }
  <template>
    <BasicDropdown @horizontalPosition="auto-right" as |dd|>
      <dd.Trigger
        @tabIndex="-1"
        @stopPropagation={{true}}
        class="datepicker-trigger relative"
      >
        <input
          autocomplete="off"
          id={{this.uniqueId}}
          name="date"
          type="text"
          class="form-control rounded"
          pattern="\d{1,2}\.\d{1,2}\.\d{2,4}"
          value={{this.displayValue}}
          placeholder={{this.placeholder}}
          {{on
            "focus"
            (preventDefault (stopPropagation (fn this.handleFocus dd)))
          }}
          {{on "blur" (fn this.handleBlur dd)}}
          {{on "change" this.handleChange}}
          {{on "input" this.checkValidity}}
        />
        {{#if @value}}
          <span
            class="clear ember-power-select-clear-btn absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            role="button"
            {{on "click" (preventDefault (stopPropagation (fn this.clear dd)))}}
          >&times;</span>
        {{/if}}
      </dd.Trigger>

      <dd.Content class="datepicker !p-0">
        <Calendar
          @center={{this.center}}
          @selected={{@value}}
          @onCenterChange={{this.updateCenter}}
          @onSelect={{fn this.updateSelect dd}}
        />
      </dd.Content>
    </BasicDropdown>

    {{yield (hash id=this.uniqueId)}}
  </template>
}
