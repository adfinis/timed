import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "tracked-built-ins";

export default class AnalysisColumnsModal extends Component {
  @service userSettings;
  @service notify;

  columns = tracked(this.userSettings.getTableColumns("analysis"));

  @action
  toggleColumn(column) {
    column.isVisible = !column.isVisible;
    this.columns = [...this.columns];
  }

  @action
  save() {
    try {
      for (const column of this.columns) {
        this.userSettings.updateColumnVisibility(
          "analysis",
          column.label,
          column.isVisible,
        );
      }
      this.args.onClose();
    } catch {
      this.notify.error("An error when updating the columns visibility");
    }
  }
}
