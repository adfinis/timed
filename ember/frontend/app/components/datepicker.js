import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { scheduleTask } from "ember-lifeline";
import { DateTime } from "luxon";

const DISPLAY_FORMAT = "dd.MM.yyyy";

const PARSE_FORMAT = "d.M.yyyy";

const parse = (value) =>
  value ? DateTime.fromFormat(value, PARSE_FORMAT) : null;

export default class Datepicker extends Component {
  placeholder = DISPLAY_FORMAT;

  @tracked center;

  constructor(...args) {
    super(...args);

    this.uniqueId = this.args.id ?? guidFor(this);
    this.center = this.args.value ?? DateTime.now();
  }

  get displayValue() {
    return this.args.value && this.args.value.isValid
      ? this.args.value.toFormat(DISPLAY_FORMAT)
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

    const parsed = parse(target.value);

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
      const parsed = parse(value);

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
}
