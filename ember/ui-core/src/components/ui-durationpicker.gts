import { on } from "@ember/modifier";
import Component from "@glimmer/component";
import { Duration } from "luxon";
import {
  clampDuration,
  normalizeStringDuration,
  normalizeStringDayDuration,
  durationAsString,
  parseDurationFromString,
} from "../utils/duration.ts";

import {
  REPORT_DURATION_MAX,
  REPORT_DURATION_MIN,
  parseStringDuration as parseReportDuration,
} from "../utils/report-duration.ts";

import {
  ACTIVITY_DURATION_MAX,
  ACTIVITY_DURATION_MIN,
  parseStringDuration as parseActivityDuration,
} from "../utils/activity-duration.ts";

import type { TOC } from "@ember/component/template-only";

export interface BaseDurationpickerSignature {
  Args: {
    value: Duration | null;
    onChange: (newValue: Duration | null) => void;
    min: Duration;
    max: Duration;
    asString?: (value: Duration | null) => string;
    fromString?: (raw: string) => Duration;
    normalize?: (dirty: string) => string;
    step?: Duration;
    bigStep?: Duration;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLInputElement;
}

export interface DurationpickerSignature {
  Args: Omit<
    BaseDurationpickerSignature["Args"],
    "fromString" | "asString" | "normalize" | "min" | "max"
  >;
  Blocks: {
    default: [];
  };
  Element: HTMLInputElement;
}

export interface ActivityDurationpickerSignature {
  Args: DurationpickerSignature["Args"] & { seconds?: boolean };
  Blocks: {
    default: [];
  };
  Element: HTMLInputElement;
}

const _durationAsString = (duration: Duration | null) =>
  duration ? durationAsString(duration) : "";

export default class Durationpicker extends Component<BaseDurationpickerSignature> {
  get asString() {
    return this.args.asString ?? _durationAsString;
  }

  get value() {
    return this.args.value ?? Duration.fromMillis(0);
  }

  get clamp() {
    const { min, max } = this.args;
    return clampDuration(min, max);
  }

  get fromString() {
    return this.args.fromString ?? parseDurationFromString;
  }

  get normalize() {
    return this.args.normalize ?? normalizeStringDuration;
  }

  get step() {
    return this.args.step ?? Duration.fromObject({ minutes: 15 });
  }

  get bigStep() {
    return this.args.bigStep ?? Duration.fromObject({ hours: 1 });
  }

  onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    // if the input is empty/cleared, we set the duration to null
    // otherwise arrow keys / scroll wheel would use the previous time
    if (!target.value) {
      this.args.onChange(null);
    }
  };

  onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    // prevent normalize() running on empty strings
    if (!target.value) {
      // no need to `onChange(null)` here, since `onInput` already did that
      return;
    }

    const clean = this.normalize(target.value);
    target.value = clean;

    const res = this.fromString(clean);
    if (res) {
      this.args.onChange(this.clamp(res));
    }
  };

  onKeydown = (e: KeyboardEvent) => {
    if (e.shiftKey || !(e.key === "ArrowUp" || e.key === "ArrowDown")) {
      return;
    }

    const result = this.value[e.key === "ArrowUp" ? "plus" : "minus"](
      e.ctrlKey ? this.bigStep : this.step,
    );

    this.args.onChange(this.clamp(result));
  };

  onMousewheel = (e: WheelEvent) => {
    const result = this.value[e.deltaY < 0 ? "plus" : "minus"](this.step);

    this.args.onChange(this.clamp(result));
  };

  <template>
    <input
      placeholder="00:00"
      {{on "change" this.onChange}}
      {{on "keydown" this.onKeydown}}
      {{on "wheel" this.onMousewheel}}
      {{on "input" this.onInput}}
      value={{this.asString @value}}
      ...attributes
      type="text"
    />
  </template>
}

const ReportDurationpicker = <template>
  {{#let
    (component
      Durationpicker
      fromString=parseReportDuration
      max=REPORT_DURATION_MAX
      min=REPORT_DURATION_MIN
      normalize=normalizeStringDayDuration
    )
    as |Dpicker|
  }}
    <Dpicker ...attributes @value={{@value}} @onChange={{@onChange}} />
  {{/let}}
</template> as TOC<DurationpickerSignature>;

const ActivityDurationpicker = <template>
  {{#let
    (component
      Durationpicker
      fromString=parseActivityDuration
      max=ACTIVITY_DURATION_MAX
      min=ACTIVITY_DURATION_MIN
      normalize=normalizeStringDayDuration
    )
    as |Dpicker|
  }}
    <Dpicker ...attributes @value={{@value}} @onChange={{@onChange}} />
  {{/let}}
</template> as TOC<ActivityDurationpickerSignature>;

export { ActivityDurationpicker, ReportDurationpicker };
