import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { dropTask } from "ember-concurrency";

import ReportValidations from "timed/validations/report";

export default class ReportRowComponent extends Component {
  @service abilities;

  ReportValidations = ReportValidations;

  /**
   * Save the row
   *
   * @method save
   * @public
   */
  save = dropTask(async (changeset) => {
    if (this.args.onSave) {
      await this.args.onSave(changeset);
    }
  });
  /**
   * Delete the row
   *
   * @method delete
   * @public
   */
  @action
  delete() {
    this.args.onDelete(this.args.report);
  }

  @action
  updateTask(cs, task) {
    cs.task = task;
    cs.remainingEffort = task?.mostRecentRemainingEffort;
  }
}
