import Transform from "@ember-data/serializer/transform";
import moment from "moment";

import startPaddingTag from "customer-center/utils/start-padding-tag";

/**
 * The django duration transform
 *
 * This transforms a django duration into a moment duration
 *
 * Django formats the timedelta like this: `DD HH:MM:ss.uuuuuu`. However,
 * days and microseconds are optional.
 *
 * @see http://www.django-rest-framework.org/api-guide/fields/#durationfield
 * @see https://github.com/django/django/blob/master/django/utils/duration.py
 */
export default class DjangoDurationTransform extends Transform {
  /**
   * Deserialize the django duration into a moment duration
   */
  deserialize(serialized) {
    if (!serialized) {
      return null;
    }

    const re = new RegExp(/^(-?\d+)?\s?(\d{2}):(\d{2}):(\d{2})(\.\d{6})?$/);

    const [, days, hours, minutes, seconds, microseconds] = serialized
      .match(re)
      .map((m) => Number(m) || 0);

    return moment.duration({
      days,
      hours,
      minutes,
      seconds,
      milliseconds: microseconds * 1000,
    });
  }

  /**
   * Serialize the moment duration into a django duration
   */
  serialize(deserialized) {
    if (!moment.isDuration(deserialized)) {
      console.warn(
        "Transform Django Duration: Non-duration value has been received."
      );
      return deserialized;
    }

    const { days, hours, minutes, seconds, microseconds } =
      this._getDurationComponentsTimedeltaLike(deserialized);

    let string = startPaddingTag(2)`${hours}:${minutes}:${seconds}`;

    if (days) {
      string = `${days} ${string}`;
    }

    if (microseconds) {
      string = `${string}.${microseconds.toString().padStart(6)}`;
    }

    return string;
  }

  /**
   * Get the duration components from the duration like pythons timedelta does it.
   *
   * This means that a duration of -1 hour becomes a duration of -1 day +23
   * hours, so we never have a negative hour, minute, second or millisecond.
   * ONLY days can be negative!
   */
  _getDurationComponentsTimedeltaLike(duration) {
    const days = Math.floor(duration.asDays());
    const milliseconds = Math.abs(moment.duration({ days }) - duration);

    const positiveDuration = moment.duration(milliseconds);

    return {
      days,
      hours: positiveDuration.hours(),
      minutes: positiveDuration.minutes(),
      seconds: positiveDuration.seconds(),
      microseconds: Math.round(positiveDuration.milliseconds() * 1000),
    };
  }
}
