import { getOwner } from "@ember/application";
import { scheduleOnce } from "@ember/runloop";
import Service, { service } from "@ember/service";
import { camelize, capitalize } from "@ember/string";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import { dropTask, task, timeout } from "ember-concurrency";
import moment from "moment";
import { trackedTask } from "reactiveweb/ember-concurrency";

import formatDuration from "timed/utils/format-duration";

/**
 * Tracking service
 *
 * This contains some methods, the application needs on multiple routes
 *
 * @class TrackingService
 * @extends Ember.Service
 * @public
 */
export default class TrackingService extends Service {
  /**
   * The store service
   *
   * @property {Ember.Store} store
   * @public
   */
  @service store;

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  @service notify;

  /**
   * Flag indicating if the tracking reports is currently generated.
   * This is used to prevent doubled time accumulation in task sum displays.
   */
  @tracked generatingReports = false;
  @tracked _date;

  // collected request arguments for fetching tasks
  projectQueue = new Set();
  // collected request arguments for fetching projects
  customerQueue = new Set();

  constructor(...args) {
    super(...args);

    this.fetchActiveActivity.perform();
  }

  get date() {
    return this._date ?? moment();
  }

  set date(date) {
    this._date = date;
  }

  /**
   * Init hook, get the current activity
   *
   * @method init
   * @public
   */
  fetchActiveActivity = task(async () => {
    await Promise.resolve();

    const actives = await this.store.query("activity", {
      include: "task,task.project,task.project.customer",
      active: true,
    });

    this.activity = actives[0] ?? null;

    this._computeTitle.perform();
  });

  /**
   * The application
   *
   * @property {Ember.Application} application
   * @public
   */
  get application() {
    return getOwner(this).lookup("application:main");
  }

  /**
   * The default application title
   *
   * @property {String} title
   * @public
   */
  get title() {
    return capitalize(camelize(this.application.name || "Timed"));
  }

  /**
   * Set the doctitle
   *
   * @method setTitle
   * @param {String} title The title to set
   * @public
   */
  setTitle(title) {
    scheduleOnce(
      "afterRender",
      this,
      this.scheduleDocumentTitle.bind(this, title),
    );
  }

  scheduleDocumentTitle(t) {
    document.title = t;
  }

  /**
   * Set the title of the application to show the current tracking time and
   * task
   *
   * @method _computeTitle
   * @private
   */
  _computeTitle = task(async () => {
    while (this.activity.active) {
      const duration = moment.duration(moment().diff(this.activity.from));

      let task = "Unknown Task";

      if (this.activity.task.content) {
        const c = this.activity.task.get("project.customer.name");
        const p = this.activity.get("task.project.name");
        const t = this.activity.get("task.name");

        task = `${c} > ${p} > ${t}`;
      }

      this.setTitle(`${formatDuration(duration)} (${task})`);

      if (macroCondition(isTesting())) {
        return;
      }

      // eslint-disable-next-line no-await-in-loop
      await timeout(1000);
    }
  });

  /**
   * The current activity
   *
   * @property {Activity} currentActivity
   * @public
   */
  @tracked _activity = null;

  /**
   * The currenty activity or create a new one if none is set
   *
   * @property {Activity} activity
   * @public
   */
  get activity() {
    return this._activity;
  }

  set activity(value) {
    const newActivity = value || this.store.createRecord("activity");

    this._activity = newActivity;
  }

  /**
   * Start the activity
   *
   * @method startActivity
   * @public
   */
  startActivity = dropTask(async () => {
    try {
      const activity = await this.activity.start();
      this.activity = activity;

      this.notify.success("Activity was started");
    } catch (e) {
      this.notify.error("Error while starting the activity");
    } finally {
      this._computeTitle.perform();
    }
  });

  /**
   * Stop the activity
   *
   * @method stopActivity
   * @public
   */
  stopActivity = dropTask(async () => {
    try {
      if (!this.activity?.isNew) {
        await this.activity.stop();

        this.notify.success("Activity was stopped");
      }

      this.activity = null;
    } catch (e) {
      this.notify.error("Error while stopping the activity");
    } finally {
      this.setTitle(this.title);
    }
  });

  get hasActiveActivity() {
    return this.activity?.active;
  }

  get activeCustomer() {
    return (
      this.hasActiveActivity && this.activity?.task?.get("project.customer")
    );
  }

  get activeProject() {
    return this.hasActiveActivity && this.activity?.task?.get("project");
  }

  get activeTask() {
    return this.hasActiveActivity && this.activity?.get("task");
  }

  /**
   * The 10 last used tasks
   *
   * @property {EmberConcurrency.Task} recentTasks
   * @public
   */
  fetchRecentTasks = dropTask(async () => {
    await Promise.resolve();
    return await this.store.query("task", {
      my_most_frequent: 10,
      include: "project,project.customer",
    });
  });

  get recentTasks() {
    return this.recentTasksData.value ?? [];
  }

  /**
   * All users
   *
   * @property {EmberConcurrency.Task} users
   * @public
   */
  users = dropTask(async () => await this.store.query("user", {}));

  /**
   * All customers
   *
   * @property {EmberConcurrency.Task} customers
   * @public
   */
  fetchCustomers = dropTask(async () => {
    await Promise.resolve();
    return await this.store.query("customer", {});
  });

  customersData = trackedTask(this, this.fetchCustomers, () => {});

  get customers() {
    return this.customersData.value ?? [];
  }

  /**
   * Projects filtered by customer
   *
   * @property {EmberConcurrency.Task} projects
   * @param {Number} customer The customer id to filter by
   * @public
   */
  projects = task(async (customer) => {
    if (!customer) {
      // We can't test this because the UI prevents it
      throw new Error("No customer selected");
    }

    if (this.customerQueue.has(customer)) {
      /* istanbul ignore next */
      return;
    }

    this.customerQueue.add(customer);

    if (this.customerQueue.size > 1) {
      return;
    }

    // Give it 100ms to "collect" similar requests and
    // increases the efficiency even more.
    await timeout(100);

    await this.store.query("project", {
      customer: [...this.customerQueue].join(","),
    });

    this.customerQueue.clear();

    return;
  });

  /**
   * Tasks filtered by project
   *
   * @property {EmberConcurrency.Task} tasks
   * @param {Number} project The project id to filter by
   * @public
   */
  tasks = task(async (project) => {
    if (!project) {
      // We can't test this because the UI prevents it
      throw new Error("No project selected");
    }

    if (this.projectQueue.has(project)) {
      /* istanbul ignore next */
      return;
    }

    this.projectQueue.add(project);

    if (this.projectQueue.size > 1) {
      return;
    }

    // Give it 100ms to "collect" similar requests and
    // increases the efficiency even more.
    await timeout(100);

    await this.store.query("task", {
      project: [...this.projectQueue].join(","),
    });

    this.projectQueue.clear();

    return;
  });

  recentTasksData = trackedTask(this, this.fetchRecentTasks, () => []);
}
