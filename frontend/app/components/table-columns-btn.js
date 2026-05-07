import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "tracked-built-ins";

export default class AnalysisColumnsBtn extends Component {
  @tracked isModalVisible = false;
  @service userSettings;
  @service notify;

  get tableName() {
    return this.args.tableName;
  }

  columns = tracked(this.userSettings.getTableColumns(this.tableName));

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
          this.tableName,
          column.label,
          column.isVisible,
        );
      }
      this.isModalVisible = !this.isModalVisible;
    } catch {
      this.notify.error("Could not update the table column configuration.");
    }
  }
}
