import { DateTime, Duration } from "luxon";
import Component from "@glimmer/component";
import Durationpicker from "./ui-durationpicker.gts";

import {
  parseStringDuration,
  DAY_DURATION_MIN,
  DAY_DURATION_MAX,
} from "../utils/day-duration.ts";
import { assert } from "@ember/debug";

// NOTE: we store "Time"s as `luxon.DateTime`s

export interface BaseTimepickerSignature {
  Args: {
    /** value of time as duration */
    value: DateTime | null;
    onChange: (newValue: DateTime | null) => void;

    /** min time */
    min?: DateTime | Duration;

    /** max time */
    max?: DateTime | Duration;

    asString?: (value: Duration | null) => string;

    fromString?: (raw: string) => Duration;
    normalize?: (dirty: string) => string;

    /** the small step when used via arrow keys / scroll

    defaults to 1 minute */
    step?: Duration;

    /** the big step when used via arrow keys / scroll

    defaults to 15 minutes */
    bigStep?: Duration;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLInputElement;
}

const timeFromDuration = (d: Duration<true>) => {
  return { hour: d.hours, minute: d.minutes };
};

const durationFromDateTime = (dt: DateTime) => {
  const { hour, minute } = dt;
  return Duration.fromObject({ hour, minute });
};

const durationFrom = (d: DateTime | Duration) => {
  if (DateTime.isDateTime(d)) return durationFromDateTime(d);
  return d;
};

export default class Timepicker extends Component<BaseTimepickerSignature> {
  get asDuration() {
    const value = this.args.value;
    if (!value) return value;
    return durationFromDateTime(value);
  }

  get durationFromString() {
    return this.args.fromString ?? parseStringDuration;
  }

  onChange = (newValue: Duration | null) => {
    const { onChange, value } = this.args;
    if (!newValue) return onChange(newValue);
    const oldValue = value ?? DateTime.now();
    onChange(oldValue.set(timeFromDuration(newValue)));
  };

  get step() {
    return this.args.step ?? Duration.fromObject({ minute: 1 });
  }

  get bigStep() {
    return this.args.bigStep ?? Duration.fromObject({ minute: 15 });
  }

  get bounds() {
    let { min, max } = this.args;
    if (!min) min = DAY_DURATION_MIN;
    min = durationFrom(min).shiftTo("hours", "minutes");
    if (!max) max = DAY_DURATION_MAX;
    max = durationFrom(max).shiftTo("hours", "minutes");
    assert(
      "@min must be smaller than @max",
      min.as("milliseconds") < max.as("milliseconds"),
    );
    return { min, max };
  }

  <template>
    <Durationpicker
      @min={{this.bounds.min}}
      @max={{this.bounds.max}}
      @value={{this.asDuration}}
      @onChange={{this.onChange}}
      @fromString={{this.durationFromString}}
      @normalize={{@normalize}}
      @asString={{@asString}}
      @step={{this.step}}
      @bigStep={{this.bigStep}}
      ...attributes
    />
  </template>
}
