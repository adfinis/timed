/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import validateDateTime from "timed/validators/datetime";

/**
 * Validations for activities
 *
 * @class ActivityValidations
 * @public
 */
export default {
  from: validateDateTime({ lt: "to" }),
  to: validateDateTime({ gt: "from" }),
};
