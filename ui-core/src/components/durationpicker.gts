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
    value: Duration;
    onChange: (newValue: Duration) => void;
    min: Duration;
    max: Duration;
    asString?: (value: Duration) => string;
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

export default class Durationpicker extends Component<BaseDurationpickerSignature> {
  get asString() {
    return durationAsString;
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

  onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const clean = this.normalize(target.value);
    target.value = clean;

    const res = this.fromString(clean);
    if (res) {
      this.args.onChange(res);
    }
  };

  onKeydown = (e: KeyboardEvent) => {
    const { value, onChange } = this.args;

    if (e.shiftKey || !(e.key === "ArrowUp" || e.key === "ArrowDown")) {
      return;
    }

    const result = value[e.key === "ArrowUp" ? "plus" : "minus"](
      e.ctrlKey ? this.bigStep : this.step,
    );

    onChange(this.clamp(result).rescale());
  };

  onMousewheel = (e: WheelEvent) => {
    const { value, onChange } = this.args;

    const result = value[e.deltaY < 0 ? "plus" : "minus"](this.step);

    onChange(this.clamp(result).rescale());
  };

  <template>
    <input
      placeholder="00:00"
      {{on "change" this.onChange}}
      {{on "keydown" this.onKeydown}}
      {{on "wheel" this.onMousewheel}}
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
