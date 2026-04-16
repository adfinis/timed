import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class AnalysisColumnsModal extends Component {
  @service userSettings;
  @service notify;

  /** just to not call the update with each toggle,
   * we are saving a local copy,
   * and updating with save function
   */
  @tracked localhidden = [];

  get hiddenColumns() {
    return this.localhidden;
  }

  constructor(...args) {
    super(...args);
    this.localhidden = this.userSettings
      .getTableColumns("analysis")
      .filter((col) => !col.isVisible)
      .map((col) => col.lable);
  }

  get allTableColumns() {
    return this.userSettings.getTableColumns("analysis");
  }

  @action
  toggleColumn(columnLabel) {
    if (this.localhidden.includes(columnLabel)) {
      this.localhidden = this.localhidden.filter(
        (label) => label !== columnLabel,
      );
      return;
    }
    this.localhidden.push(columnLabel);
  }

  @action
  save() {
    try {
      for (const column of this.allTableColumns) {
        this.userSettings.updateColumnVisibility(
          "analysis",
          column.label,
          this.localhidden.includes(column.label),
        );
      }
      this.args.onClose();
    } catch (error) {
      console.log({ error });
      this.notify.error("An error when updating the columns visibility");
    }
  }
}
