/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";

import AttendanceValidator from "timed/validations/attendance";

/**
 * The index attendances controller
 *
 * @class IndexAttendancesController
 * @extends Ember.Controller
 * @public
 */
export default class AttendanceController extends Controller {
  @service notify;
  @service store;
  @service tracking;
  @service currentUser;

  AttendanceValidator = AttendanceValidator;

  /**
   * Validate the given changeset
   *
   * @method validateChangeset
   * @param {EmberChangeset.Changeset} changeset The changeset to validate
   * @public
   */
  @action
  validateChangeset(changeset) {
    changeset.validate();
  }
  /**
   * All attendances currently in the store
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  get _allAttendances() {
    return this.store.peekAll("attendance");
  }

  /**
   * The attendances filtered by the selected day
   *
   * @property {Attendance[]} attendances
   * @public
   */
  get attendances() {
    return this._allAttendances.filter((a) => {
      return (
        a.get("date").hasSame(this.model, "day") &&
        a.get("user.id") === this.currentUser.user.id &&
        !a.get("isDeleted")
      );
    });
  }

  /**
   * Save an attendance
   *
   * @method saveAttendance
   * @param {Changeset} attendance The attendance to save
   * @public
   */
  @action
  async saveAttendance(attendance) {
    try {
      await attendance.save();

      this.notify.success("Attendance was saved");
    } catch {
      this.notify.error("Error while saving the attendance");
    }
  }

  /**
   * Delete an attendance
   *
   * @method deleteAttendance
   * @param {Attendance} attendance The attendance to delete
   * @public
   */
  @action
  async deleteAttendance(attendance) {
    try {
      await this.store.peekRecord("attendance", attendance.id).destroyRecord();

      this.notify.success("Attendance was deleted");
    } catch {
      this.notify.error("Error while deleting the attendance");
    }
  }

  /**
   * Add a new attendance
   *
   * @method addAttendance
   * @public
   */
  @action
  async addAttendance() {
    try {
      const date = this.tracking.date;

      const from = date.set({
        hours: 8,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      const to = date.set({
        hours: 11,
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      });

      const attendance = this.store.createRecord("attendance", {
        date,
        from,
        to,
      });

      await attendance.save();

      this.notify.success("Attendance was added");
    } catch {
      this.notify.error("Error while adding the attendance");
    }
  }
}
