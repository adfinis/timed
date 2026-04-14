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
    this.localhidden = this.userSettings.getHiddenColumns("analysisTable");
  }

  get allTableColumns() {
    return this.userSettings.getAllTableColumns("analysisTable");
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
    this.userSettings.updateHiddenColumns("analysisTable", this.localhidden);
    this.notify.success("The columns are updated successfully");
    this.args.onClose();
  }
}
