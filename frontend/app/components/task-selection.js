import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout, dropTask } from "ember-concurrency";
import { runTask } from "ember-lifeline";
import { trackedTask } from "reactiveweb/ember-concurrency";

import customerOptionTemplate from "timed/components/optimized-power-select/custom-options/customer-option";
import projectOptionTemplate from "timed/components/optimized-power-select/custom-options/project-option";
import taskOptionTemplate from "timed/components/optimized-power-select/custom-options/task-option";
import customSelectedTemplate from "timed/components/optimized-power-select/custom-select/task-selection";
/**
 * Component for selecting a task, which consists of selecting a customer and
 * project first.
 *
 * @class TaskSelectionComponent
 * @extends Ember.Component
 * @public
 */
export default class TaskSelectionComponent extends Component {
  @service store;
  @service tracking;

  /**
   * The manually selected customer
   *
   * @property {Customer} _customer
   * @private
   */
  @tracked
  _customer;

  /**
   * The manually selected project
   *
   * @property {Project} _project
   * @private
   */
  @tracked
  _project;

  /**
   * The manually selected task
   *
   * @property {Task} _task
   * @private
   */
  @tracked
  _task;

  constructor(...args) {
    super(...args);

    // preselect initial task
    this._setInitial();

    if (this.args.task) {
      this.onTaskChange(this.args.task, { preventAction: true });
    }

    if (this.args.liveTracking) {
      // we track "_activity" here since we can not track the public getters directly
      this.tracking.addObserver(
        "_activity",
        this.handleTrackingActiveActivityChanged.perform,
      );
    }
  }

  willDestroy(...args) {
    if (this.args.liveTracking) {
      this.tracking.removeObserver(
        "_activity",
        this.handleTrackingActiveActivityChanged.perform,
      );
    }
    super.willDestroy(...args);
  }

  handleTrackingActiveActivityChanged = restartableTask(async () => {
    // wait a little to catch multiple updates to the prop.
    await timeout(50);

    if (this.args.liveTracking && !this.tracking.hasActiveActivity) {
      this.clear();
    }
  });

  async _setInitial() {
    await this.tracking.fetchActiveActivity?.last;

    const initial = this.args.initial ?? {
      customer: null,
      project: null,
      task: null,
    };

    const options = { preventAction: true };

    // the objects are possibily wrapped in a proxy which would
    // confuse the upcoming null check
    const [customer, project, task] = await Promise.all([
      initial.customer,
      initial.project,
      initial.task,
    ]);

    this._task = task ?? this.args.task;
    this._project = this._task
      ? await this._task.customer
      : (project ?? this.args.project);
    this._customer = this._project
      ? await this._project.customer
      : (customer ?? this.args.customer);

    if (this._task) {
      this.onTaskChange(this._task, options);
    } else if (this._project) {
      this.onProjectChange(this._project, options);
    } else if (this._customer) {
      this.onCustomerChange(this._customer, options);
    } else {
      this.tracking.fetchCustomers.perform();
    }
  }

  /**
   * Template for displaying the customer options
   *
   * @property {*} customerOptionTemplate
   * @public
   */
  customerOptionTemplate = customerOptionTemplate;

  /**
   * Template for displaying the project options
   *
   * @property {*} projectOptionTemplate
   * @public
   */
  projectOptionTemplate = projectOptionTemplate;

  /**
   * Template for displaying the task options
   *
   * @property {*} taskOptionTemplate
   * @public
   */
  taskOptionTemplate = taskOptionTemplate;

  /**
   * Template for displaying the selected option
   *
   * @property {*} selectedTemplate
   * @public
   */
  selectedTemplate = customSelectedTemplate;

  /**
   * Whether to show archived customers, projects or tasks
   *
   * @property {Boolean} archived
   * @public
   */
  get archived() {
    return this.args.archived ?? false;
  }

  /**
   * Whether to show history entries in the customer selection or not
   *
   * @property {Boolean} history
   * @public
   */
  get history() {
    return this.args.history ?? true;
  }

  /**
   * The selected customer
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Customer} customer
   * @public
   */
  get customer() {
    // Without unwrapping of the proxy ember-power-select will stick to wrong reference after clearing
    return this.args.liveTracking
      ? (this.tracking.activeCustomer?.content ?? this._customer)
      : this._customer;
  }

  /**
   * The selected project
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Project} project
   * @public
   */
  get project() {
    // Without unwrapping of the proxy ember-power-select will stick to wrong reference after clearing
    return this.args.liveTracking
      ? (this.tracking.activeProject?.content ?? this._project)
      : this._project;
  }

  /**
   * The currently selected task
   *
   * @property {Task} task
   * @public
   */
  get task() {
    return this.args.liveTracking
      ? (this.tracking.activeTask?.content ?? this._task)
      : this._task;
  }

  /**
   * All customers and recent tasks which are selectable in the dropdown
   *
   * @property {Array} customersAndRecentTasks
   * @public
   */
  customersAndRecentTasksTask = dropTask(async () => {
    await Promise.resolve();

    /* istanbul ignore if*/
    if (
      !this.tracking.customers?.length ||
      !this.tracking.recentTasks?.length
    ) {
      await this.tracking.fetchRecentTasks.last;
      await this.tracking.fetchCustomers.last;
    }

    let ids = [];

    if (this.history) {
      const last = this.tracking.recentTasks;

      ids = last ? last.map((t) => t.id) : [];
    }

    const customers = this.store
      .peekAll("customer")
      ?.filter(this.filterByArchived)
      .toSorted((c) => c.name);

    const tasks = this.store.peekAll("task").filter((task) => {
      return ids.includes(task.id) && this.filterByArchived(task);
    });

    return [...tasks, ...customers];
  });

  get customersAndRecentTasks() {
    return this._customersAndRecentTasks.value ?? [];
  }

  _projects = dropTask(this, async () => {
    return (await this.customer?.projects)
      ?.filter(this.filterByArchived)
      .toSorted((p) => p.name);
  });

  _projectsTask = trackedTask(this, this._projects, () => [this._customer?.id]);

  get projects() {
    return this._projectsTask.value ?? [];
  }

  _tasks = dropTask(this, async () => {
    return (await this.project?.tasks)
      ?.filter(this.filterByArchived)
      .toSorted((t) => t.name);
  });

  _tasksTask = trackedTask(this, this._tasks, () => [this._project?.id]);

  get tasks() {
    return this._tasksTask.value ?? [];
  }

  @action
  filterByArchived(filterable) {
    //using the action decorator to bind the context for this
    return this.archived ? true : !filterable?.archived;
  }

  /**
   * Clear all comboboxes
   *
   * @method clear
   * @public
   */
  @action
  clear() {
    const options = {
      preventFetchingData: true,
      preventAction: true,
    };
    this.onCustomerChange(null, options);
  }

  @action
  reset() {
    this.clear();
    this._setInitial();
  }

  @action
  async onCustomerChange(value, options = {}) {
    const isTask = value?.get("constructor.modelName") === "task";
    if (isTask) {
      this._customer = await value.get("project.customer");
      this.onTaskChange(value);
    } else {
      this._customer = value;
    }

    if (this.customer?.id) {
      this.tracking.projects.perform(this.customer.id);
    }

    if (
      this.project &&
      (!value ||
        (!isTask && value.get("id") !== this.project.get("customer.id")))
    ) {
      this.onProjectChange(null, options);
    }

    if (!options.preventAction) {
      runTask(this, () => {
        (this.args["on-set-customer"] === undefined
          ? () => {}
          : this.args["on-set-customer"])(value);
      });
    }
  }

  @action
  onProjectChange(value, options = {}) {
    this._project = value;

    if (this.project?.id) {
      this.tracking.tasks.perform(this.project.id);
    }

    if (
      this.task &&
      (value === null || value.get("id") !== this.task.get("project.id"))
    ) {
      this.onTaskChange(null, options);
    }

    if (!this.customer && value?.get("customer.id")) {
      Promise.resolve(value.get("customer")).then((c) => {
        this.onCustomerChange(c, {
          preventAction: true,
        });
      });
    }

    if (!options.preventAction) {
      runTask(this, () => {
        (this.args["on-set-project"] === undefined
          ? () => {}
          : this.args["on-set-project"])(value);
      });
    }
  }

  @action
  onTaskChange(value, options = {}) {
    this._task = value;

    const projectId = value?.get("project.id");
    if (
      (!this.project && projectId) ||
      (projectId && this.project?.id !== projectId)
    ) {
      Promise.resolve(value.get("project")).then((p) => {
        this.onProjectChange(p, {
          preventAction: true,
        });
      });
    }

    if (!options.preventAction) {
      runTask(this, async () => {
        (this.args["on-set-task"] === undefined
          ? () => {}
          : this.args["on-set-task"])(value);
      });
    }
  }

  _customersAndRecentTasks = trackedTask(
    this,
    this.customersAndRecentTasksTask,
    () => [this.history, this.tracking.recentTasks, this.archived],
  );
}
