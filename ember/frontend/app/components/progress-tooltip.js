import { service } from "@ember/service";
import { isTesting, macroCondition } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { restartableTask, timeout } from "ember-concurrency";
import moment from "moment";
import { trackedTask } from "reactiveweb/ember-concurrency";

/**
 * Component for a tooltip showing the progress of a task or project
 *
 * @class ProgressTooltipComponent
 * @extends Ember.Component
 * @public
 */
export default class ProgressTooltipComponent extends Component {
  // The delay between becoming 'visible' and fetching the data
  delay = 300;

  @tracked spent;
  @tracked billable;
  @tracked mostRecentRemainingEffort;
  @tracked totalRemainingEffort;

  @service("metadata-fetcher") metadata;

  constructor(...args) {
    super(...args);

    /* istanbul ignore next */
    if (!this.args.model) {
      throw new Error("A model must be given");
    }

    /* istanbul ignore next */
    if (!this.args.target) {
      throw new Error("A target for the tooltip must be given");
    }

    this.spent = moment.duration();
  }

  get estimated() {
    return this.args.model.estimatedTime;
  }

  get remainingEffort() {
    const model = this.args.model;
    const isProject = model.constructor.modelName === "project";
    const hasRemainingEffortTracking = isProject
      ? model.remainingEffortTracking
      : model.get("project.remainingEffortTracking");

    if (!hasRemainingEffortTracking) {
      return null;
    }

    if (macroCondition(isTesting())) {
      return isProject
        ? model.totalRemainingEffort
        : model.mostRecentRemainingEffort;
    }

    return isProject
      ? this.totalRemainingEffort
      : this.mostRecentRemainingEffort;
  }

  // The current billable progress
  get progressBillable() {
    return this.estimated?.asHours() ? this.billable / this.estimated : 0;
  }

  get progressTotal() {
    return this.estimated?.asHours() ? this.spent / this.estimated : 0;
  }

  get progressRemainingEffort() {
    return this.estimated && this.remainingEffort?.asMinutes()
      ? (this.remainingEffort.asMinutes() + this.spent.asMinutes()) /
          this.estimated.asMinutes()
      : 0;
  }

  get badgeClass() {
    return "text-foreground-primary rounded-xl py-1 px-1.5 font-mono text-xs rounded-xl m-0.5 inline-block min-w-2.5 text-center whitespace-nowrap";
  }

  // The color of the badge and progress bar for billable time spent
  get colorBillable() {
    if (this.progressBillable > 1) {
      return "bg-danger";
    } else if (this.progressBillable >= 0.9) {
      return "bg-warning";
    }

    return "bg-success";
  }

  // The color of the badge and progress bar for total time spent
  get colorTotal() {
    if (this.progressTotal > 1) {
      return "bg-danger";
    } else if (this.progressTotal >= 0.9) {
      return "bg-warning";
    }

    return "bg-success";
  }

  // The color of the badge and progress bar for remaining effort
  get colorRemainingEffort() {
    if (this.progressRemainingEffort > 1) {
      return "bg-danger";
    } else if (this.progressRemainingEffort >= 0.9) {
      return "bg-warning";
    }

    return "bg-success";
  }

  get tooltipVisible() {
    return this._toolTipVisible.value ?? false;
  }

  _computeTooltipVisible = restartableTask(async (visible) => {
    if (visible) {
      await timeout(this.delay);

      const response = await this.metadata.fetchSingleRecordMetadata
        .linked()
        .perform(this.args.model.constructor.modelName, this.args.model.id);
      const {
        spentTime,
        spentBillable,
        mostRecentRemainingEffort,
        totalRemainingEffort,
      } = response;

      this.mostRecentRemainingEffort = mostRecentRemainingEffort;
      this.totalRemainingEffort = totalRemainingEffort;
      this.spent = spentTime;
      this.billable = spentBillable;
    }

    return visible;
  });

  _toolTipVisible = trackedTask(this, this._computeTooltipVisible, () => [
    this.args.visible,
  ]);
}
