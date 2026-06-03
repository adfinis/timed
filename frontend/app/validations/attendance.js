/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import { validatePresence } from "ember-changeset-validations/validators";

import validateDateTime from "timed/validators/datetime";

/**
 * Validations for attendances
 *
 * @class AttendanceValidations
 * @public
 */
export default {
  date: validatePresence(true),
  from: [validatePresence(true), validateDateTime({ lt: "to" })],
  to: [validatePresence(true), validateDateTime({ gt: "from" })],
};
