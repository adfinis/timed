/**
 * @module timed
 * @submodule timed-serializers
 * @public
 */
import ApplicationSerializer from "timed/serializers/application";

/**
 * The attendance serializer
 *
 * @class AttendanceSerializer
 * @extends ApplicationSerializer
 * @public
 */
export default class AttendanceSerializer extends ApplicationSerializer {
  /**
   * The attribute mapping
   *
   * This mapps some properties of the response to another
   * property name of the model
   */
  attrs = {
    from: "from-time",
    to: "to-time",
  };
}
