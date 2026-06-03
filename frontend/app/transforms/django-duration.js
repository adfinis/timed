import { Duration } from "luxon";

import { pad2joincolon } from "timed/utils/pad";
import parseDjangoDuration from "timed/utils/parse-django-duration";

const { round } = Math;

/**
 * The django duration transform
 *
 * This transforms a django duration into a `luxon.Duration`
 *
 * Django formats the timedelta like this: `DD HH:MM:ss.uuuuuu`. However,
 * days and microseconds are optional.
 *
 * @see http://www.django-rest-framework.org/api-guide/fields/#durationfield
 * @see https://github.com/django/django/blob/main/django/utils/duration.py
 *
 * @public
 */
export default class DjangoDurationTransform {
  /**
   * Deserialize the string duration from django into a luxon duration
   *
   * @method deserialize
   * @param {string} serialized The django duration
   * @return {import('luxon').Duration} The deserialized
   * @public
   */
  deserialize(serialized) {
    return parseDjangoDuration(serialized);
  }

  /**
   * Get the duration components from the duration like pythons timedelta does
   * it.
   *
   * This means that a duration of -1 hour becomes a duration of -1 day +23
   * hours, so we never have a negative hour, minute, second or millisecond.
   * ONLY days can be negative!
   *
   * @param {import('luxon').Duration} duration The duration to parse
   * @returns {object} An object containing all needed components as number
   * @private
   */
  _getDurationComponentsTimedeltaLike(duration) {
    const days = Math.floor(duration.as("days"));
    const milliseconds = Math.abs(Duration.fromObject({ days }) - duration);

    const positiveDuration = Duration.fromMillis(milliseconds).rescale();

    return {
      days,
      hours: positiveDuration.hours,
      minutes: positiveDuration.minutes,
      seconds: positiveDuration.seconds,
      microseconds: round(positiveDuration.milliseconds * 1000),
    };
  }

  /**
   * Serialize the luxon duration into a string for django
   *
   * @param {import('luxon').Duration} deserialized The duration
   * @return {string} The serialized django duration
   * @public
   */
  serialize(deserialized) {
    if (!Duration.isDuration(deserialized)) {
      return null;
    }

    const { days, hours, minutes, seconds, microseconds } =
      this._getDurationComponentsTimedeltaLike(deserialized);

    let string = pad2joincolon(hours, minutes, seconds);

    if (days) {
      string = `${days} ${string}`;
    }

    if (microseconds) {
      string += `.${String(microseconds).padStart(6, "0")}`;
    }

    return string;
  }

  static create() {
    return new this();
  }
}
