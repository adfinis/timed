import { get } from "@ember/object";
import { DateTime } from "luxon";

/** @param {DateTime} datetime */
const unwrap = (datetime) =>
  datetime && datetime.isValid ? datetime : undefined;

/**
 * Validator to determine if a value is a valid DateTime and if it is
 * greater or smaller than another property of the content.
 *
 * @param {object} options The configuration options
 * @param {string} options.gt The property to check whether it's value is greater
 * @param {string} options.lt The property to check whether it's value is lesser
 * @return {boolean|string} Whether the value is valid
 * @public
 */
export default function validateDateTime(options = { gt: null, lt: null }) {
  return (key, newValue, oldValue, changes, content) => {
    if (!newValue && content.active) {
      newValue = DateTime.now();
    }
    if (newValue?.isLuxonDateTime) {
      // for some reason ember-changeset deletes prototypes
      // to properly use the value we need to "undo" that
      Object.setPrototypeOf(newValue, DateTime.prototype);
    }
    const valid = !!newValue && newValue.isValid;

    if (!valid) {
      return "The given value is not a valid value";
    }

    if (options.gt) {
      const gtVal =
        unwrap(get(changes, options.gt)) ||
        unwrap(get(content, options.gt)) ||
        DateTime.now();
      if (newValue.toMillis() <= gtVal.toMillis()) {
        return `The value is smaller than ${options.gt}`;
      }
    }

    if (options.lt) {
      const ltVal =
        unwrap(get(changes, options.lt)) ||
        unwrap(get(content, options.lt)) ||
        DateTime.now();

      if (newValue.toMillis() >= ltVal.toMillis()) {
        return `The value is larger than ${options.lt}`;
      }
    }

    return true;
  };
}
