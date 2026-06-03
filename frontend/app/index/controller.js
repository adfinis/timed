import Controller from "@ember/controller";
import { action, get } from "@ember/object";
import { service } from "@ember/service";
import { camelize } from "@ember/string";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import { dropTask, timeout } from "ember-concurrency";
import { scheduleTask } from "ember-lifeline";
import { Duration, DateTime } from "luxon";
import { trackedFunction } from "reactiveweb/function";
import { tracked as trackedWrapper } from "tracked-built-ins";
import { cached } from "tracked-toolbox";

import AbsenceValidations from "timed/validations/absence";
import MultipleAbsenceValidations from "timed/validations/multiple-absence";

/**
 * The index controller
 *
 * @class IndexController
 * @extends Controller
 * @public
 */
export default class IndexController extends Controller {
  queryParams = ["day"];

  negate = (n) => n * -1;

  @tracked showAddModal = false;
  @tracked showEditModal = false;
  @tracked day = DateTime.now().toISODate();
  @tracked _activeActivityDuration = Duration.fromMillis(0);

  /* istanbul ignore next */
  @trackedWrapper center = DateTime.now();

  /** @type {DateTime[]} */
  @trackedWrapper disabledDates = [];

  @service currentUser;
  @service media;
  @service notify;
  @service store;
  @service tracking;

  AbsenceValidations = AbsenceValidations;
  MultipleAbsenceValidations = MultipleAbsenceValidations;

  constructor(...args) {
    super(...args);
    // this kicks off the activity sum loop
    scheduleTask(this._activitySumTask, "actions", "perform");
  }

  get _allActivities() {
    return this.store.peekAll("activity");
  }

  get _activities() {
    return this._allActivities.filter((a) => {
      return (
        a.get("date") &&
        a.get("date").hasSame(this.date, "day") &&
        a.get("user.id") === this.currentUser.user?.id &&
        !a.get("isDeleted")
      );
    });
  }

  get activitySum() {
    // Prevents wrong activity sum, while saving reports.
    // It would otherwise double the currently not transferred durations
    // while store is updating.
    if (this.tracking.generatingReports) {
      return this._lastActivitySum;
    }

    if (!this.tracking.hasActiveActivity) {
      return this.storedActivitiesDuration;
    }

    return this.storedActivitiesDuration.plus(this._activeActivityDuration);
  }

  /**
   * The duration sum of all stored activities of the selected day
   *
   * @property {Duration} activitySum
   * @public
   */
  get storedActivitiesDuration() {
    return this._activities
      .filter((a) => !a.active)
      .reduce((total, current) => {
        return total.plus(current.get("duration"));
      }, Duration.fromMillis(0));
  }

  /**
   * Compute the current activity sum
   *
   * @method _activitySum
   * @private
   */
  _activitySum() {
    // Do not trigger updates when there is no active activity, but let it run once to
    // null the duration.
    if (
      !this.tracking.hasActiveActivity &&
      this._activeActivityDuration.get("seconds") === 0
    ) {
      return;
    }
    const duration = this._activities
      .filter((a) => a.active)
      .reduce((total, current) => {
        return total.plus(DateTime.now().diff(current.get("from")));
      }, Duration.fromMillis(0));

    this._activeActivityDuration = duration;

    // Save latest activitySum for display while reports are generated.
    // See activitySum getter.
    scheduleTask(this, "actions", "_storeLastActivitySum");

    return duration;
  }

  _storeLastActivitySum() {
    this._lastActivitySum = this.activitySum;
  }

  /**
   * Run _activitySum every second.
   *
   * @method _activitySumTask
   * @private
   */
  _activitySumTask = dropTask(async () => {
    while (true) {
      this._activitySum();

      if (macroCondition(isTesting())) {
        break;
      }

      // eslint-disable-next-line no-await-in-loop
      await timeout(1000);
    }
  });

  /**
   * All attendances
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  get _allAttendances() {
    return this.store.peekAll("attendance");
  }

  /**
   * All attendances filtered by the selected day and the current user
   *
   * @property {Attendance[]} _attendances
   * @private
   */
  get _attendances() {
    return this._allAttendances.filter((attendance) => {
      return (
        attendance.get("date") &&
        attendance.get("date").hasSame(this.date, "day") &&
        attendance.get("user.id") === this.currentUser.user?.id &&
        !attendance.get("isDeleted")
      );
    });
  }

  /**
   * The duration sum of all attendances of the selected day
   *
   * @property {Duration} attendanceSum
   * @public
   */
  get attendanceSum() {
    return this._attendances.reduce((total, current) => {
      return total.plus(current.duration);
    }, Duration.fromMillis(0));
  }

  /**
   * All reports
   *
   * @property {Report[]} allReports
   * @private
   */
  get allReports() {
    return this.store.peekAll("report");
  }

  /**
   * All absences
   *
   * @property {Absence[]} _allAbsences
   * @private
   */
  get allAbsences() {
    return this.store.peekAll("absence");
  }

  /**
   * All reports filtered by the selected day and the current user
   *
   * @property {Report[]} _reports
   * @private
   */
  get _reports() {
    return this.allReports.filter((report) => {
      return (
        report.date.hasSame(this.date, "day") &&
        report.get("user.id") === this.currentUser.user?.id &&
        !report.isNew &&
        !report.isDeleted
      );
    });
  }

  /**
   * All absences filtered by the selected day and the current user
   *
   * @property {Absence[]} _absences
   * @private
   */
  get _absences() {
    return this.allAbsences.filter((absence) => {
      return (
        absence.date.hasSame(this.date, "day") &&
        absence.get("user.id") === this.currentUser.user?.id &&
        !absence.isNew &&
        !absence.isDeleted
      );
    });
  }

  /**
   * The duration sum of all reports of the selected day
   *
   * @property {Duration} reportSum
   * @public
   */
  get reportSum() {
    const reportDurations = this._reports.map((r) => r.duration);
    const absenceDurations = this._absences.map((a) => a.duration);

    return [...reportDurations, ...absenceDurations].reduce(
      (val, dur) => val.plus(dur),
      Duration.fromMillis(0),
    );
  }

  /**
   * The absence of the current day if available
   *
   * This should always be the first of all absences of the day because in
   * theory, we can only have one absence per day.
   *
   * @property {Absence} absence
   * @public
   */
  get absence() {
    return this._absences[0] ?? null;
  }

  /**
   * All absence types
   *
   * @property {AbsenceType[]} absenceTypes
   * @public
   */
  get absenceTypes() {
    return this.store.peekAll("absence-type");
  }

  /**
   * The currently selected day as a luxon object
   *
   * @property {DateTime} date
   * @public
   */
  @cached
  get date() {
    return DateTime.fromISO(this.day);
  }

  set date(value) {
    this.day = value.toISODate();
    // share the newly selected date
    this.tracking.date = value;
  }

  /**
   * The expected worktime of the user
   *
   * @property {Duration} expectedWorktime
   * @public
   */
  get expectedWorktime() {
    return this.currentUser.user.activeEmployment.worktimePerDay;
  }

  /**
   * The workdays for the location related to the users active employment
   *
   * @property {Number[]} workdays
   * @public
   */
  get workdays() {
    // eslint-disable-next-line ember/no-get
    return get(this, "currentUser.user.activeEmployment.location.workdays");
  }

  get weeklyOverviewSliceValue() {
    if (this.media.isLg) {
      return 5;
    }

    if (this.media.isMd) {
      return 10;
    }

    if (this.media.isSm) {
      return 15;
    }

    return 21;
  }

  /**
   * The task to compute the data for the weekly overview
   *
   * @property {EmberConcurrency.Task} _weeklyOverviewData
   * @private
   */
  weeklyOverviewData = trackedFunction(this, async () => {
    const allReports = this.allReports.filter(
      (report) =>
        report.get("user.id") === this.currentUser.user.get("id") &&
        !report.get("isDeleted") &&
        !report.get("isNew"),
    );

    const allAbsences = this.allAbsences.filter(
      (absence) =>
        absence.get("user.id") === this.currentUser.user.get("id") &&
        !absence.get("isDeleted") &&
        !absence.get("isNew"),
    );

    const allHolidays = this.store.peekAll("public-holiday");

    // Build an object containing reports, absences and holidays
    // {
    //  '2017-03-21': {
    //    reports: [report1, report2, ...],
    //    absences: [absence1, ...],
    //    publicHolidays: [publicHoliday1, ...]
    //  }
    //  ...
    // }
    const container = [...allReports, ...allAbsences, ...allHolidays].reduce(
      (obj, model) => {
        const d = model.get("date").toISODate();

        obj[d] = obj[d] || { reports: [], absences: [], publicHolidays: [] };

        obj[d][`${camelize(model.constructor.modelName)}s`].push(model);

        return obj;
      },
      {},
    );

    return Array.from({ length: 56 }, (value, index) =>
      this.date.plus({ days: index - 28 }),
    ).map((d) => {
      const {
        reports = [],
        absences = [],
        publicHolidays = [],
      } = container[d.toISODate()] || {};

      let prefix = "";

      if (publicHolidays.length) {
        prefix = publicHolidays[0].get("name");
      } else if (absences.length) {
        prefix = absences[0].get("absenceType.name");
      }

      return {
        day: d,
        active: d.hasSame(this.date, "day"),
        absence: !!absences.length,
        workday: this.workdays.includes(d.weekday),
        worktime: [
          ...reports.map((r) => r.duration),
          ...absences.map((r) => r.duration),
        ].reduce((val, dur) => val.plus(dur), Duration.fromMillis(0)),
        holiday: !!publicHolidays.length,
        prefix,
      };
    });
  });

  /**
   * Set a new center for the calendar and load all disabled dates
   *
   * @method setCenter
   * @param {Duration} value The value to set center to
   * @public
   */
  setCenter = dropTask(async (center) => {
    await Promise.resolve();

    const from = center
      .startOf("month")
      .startOf("week")
      .startOf("day")
      .plus(1, { days: 1 });

    const to = center
      .endOf("month")
      .endOf("week")
      .endOf("day")
      .plus(1, { days: 1 });

    const params = {
      from_date: from.toISODate(),
      to_date: to.toISODate(),
    };

    const absences = await this.store.query("absence", {
      ...params,
      user: this.currentUser.user.id,
    });

    const publicHolidays = await this.store.query("public-holiday", {
      ...params,

      location: this.currentUser.user.activeEmployment.location.get("id"),
    });

    const disabled = [
      ...absences.map((a) => a.date),
      ...publicHolidays.map((h) => h.date),
    ];

    const workdays = this.workdays;
    let date = from;

    while (date < to) {
      if (!workdays.includes(date.weekday)) {
        disabled.push(date);
      }
      date = date.plus({ days: 1 });
    }

    this.disabledDates = disabled;
    this.center = center;
  });

  /**
   * The disabled dates without the current date
   *
   * @property {DateTime[]} disabledDatesForEdit
   * @public
   */
  get disabledDatesForEdit() {
    return this.disabledDates.filter(
      (date) => !date.hasSame(this.absence.date, "day"),
    );
  }

  /**
   * Rollback the changes made in the absence dialogs
   *
   * @method rollback
   * @param {EmberChangeset.Changeset} changeset The changeset to rollback
   * @public
   */
  @action
  rollback(changeset) {
    this.setCenter.perform(this.date);

    changeset.rollback();
  }

  @action
  updateSelection(changeset, key, value, ...args) {
    changeset.set(key, value.datetime);
    // prevent pointer event from bubbling
    args.lastObject?.preventDefault();
  }

  /**
   * Edit an existing absence
   *
   * @method editAbsence
   * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
   * @public
   */
  @action
  async saveAbsence(changeset) {
    try {
      this.send("loading");

      await changeset.save();

      this.showEditModal = false;
    } catch {
      this.notify.error("Error while saving the absence");
    } finally {
      this.send("finished");
    }
  }

  /**
   * Delete an absence
   *
   * @method deleteAbsence
   * @param {Absence} absence The absence to delete
   * @public
   */
  @action
  async deleteAbsence(absence) {
    try {
      this.send("loading");

      await absence.destroyRecord();

      this.showEditModal = false;
    } catch {
      this.notify.error("Error while deleting the absence");
    } finally {
      this.send("finished");
    }
  }

  /**
   * Add one or more absences
   *
   * @method addAbsence
   * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
   * @public
   */
  @action
  async addAbsence(changeset) {
    try {
      const absenceType = changeset.get("absenceType");
      const comment = changeset.get("comment");
      const dates = changeset.get("dates");
      const results = [];
      for (const date of dates) {
        const absence = this.store.createRecord("absence", {
          absenceType,
          date,
          comment,
        });

        results.push(absence.save());
      }

      await Promise.all(results);

      changeset.rollback();

      this.showAddModal = false;
    } catch {
      this.notify.error("Error while adding the absence");
    } finally {
      this.send("finished");
    }
  }
}
