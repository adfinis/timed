import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";

export default class AnalysisColumnsModal extends Component {
  @service analysisTableColumns;
  @service notify;

  /** just to not call the update with each toggle,
   * we are saving a local copy,
   * and updating with save function
   */
  localhidden = [];

  constructor(...args) {
    super(...args);
    this.localhidden = this.analysisTableColumns.hiddenColumns;
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
    this.analysisTableColumns.updateHidden(this.localhidden);
    this.notify.success("The columns are updated successfully");
    this.args.onClose();
  }
}
