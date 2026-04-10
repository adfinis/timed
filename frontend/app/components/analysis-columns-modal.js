import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class AnalysisColumnsModal extends Component {
  @service userSettings;
  @service notify;

  /** just to not call the update with each toggle,
   * we are saving a local copy,
   * and updating with save function
   */
  localhidden = [];

  constructor(...args) {
    super(...args);
    this.localhidden = this.userSettings.of("analysisTable").hiddenColumns;
  }

  get allTableColumns() {
    return this.userSettings.of("analysisTable").allTableColumns;
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
    this.userSettings.of("analysisTable").updateHidden(this.localhidden);
    this.notify.success("The columns are updated successfully");
    this.args.onClose();
  }
}
