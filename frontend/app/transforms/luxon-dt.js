import { DateTime } from "luxon";

const DATE_TRANSFORM = {
  from: DateTime.fromISO,
  to: (dt) => dt.toISODate(),
};

const DATETIME_TRANSFORM = {
  from: DateTime.fromISO,
  to: (dt) => dt.toISO(),
};

const TIME_FORMAT = "HH:mm:ss";

const TIME_TRANSFORM = {
  from: (s) => DateTime.fromFormat(s, TIME_FORMAT),
  to: (dt) => dt.toFormat(TIME_FORMAT),
};

export const MODES = {
  date: DATE_TRANSFORM,
  datetime: DATETIME_TRANSFORM,
  time: TIME_TRANSFORM,
};

export default class DateTimeTransform {
  /** @param {string|null} serialized */
  deserialize(serialized, options) {
    if (serialized) return options.t.from(serialized);
    return null;
  }

  /** @param {DateTime|null} deserialized */
  serialize(deserialized, options) {
    if (deserialized && deserialized.isValid) return options.t.to(deserialized);
    return null;
  }

  static create() {
    return new this();
  }
}
