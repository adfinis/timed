import { tracked } from "@glimmer/tracking";

const ANALYSIS_TABLE_STORAGE_KEY = "analysis-table";

export default class TableColumnHelper {
  userSettings;
  @tracked hiddenColumns = [];
  allTableColumns = [];

  prepare(userSettings, allTableColumns) {
    if (!Array.isArray(allTableColumns) || !allTableColumns.length) {
      console.error(
        `${this.constructor.name} class is not configured correctly to use TableColumnHelper`,
      );
      return;
    }
    this.userSettings = userSettings;
    this.allTableColumns = allTableColumns;
    this.loadHiddenColumns();
  }

  get tableColumns() {
    return this.allTableColumns.filter(
      (column) => !this.hiddenColumns.includes(column.label),
    );
  }

  loadHiddenColumns() {
    this.hiddenColumns = this.userSettings.load(ANALYSIS_TABLE_STORAGE_KEY, []);
  }

  updateHidden(hiddenLabels) {
    this.hiddenColumns = hiddenLabels;
    this.userSettings.save(ANALYSIS_TABLE_STORAGE_KEY, hiddenLabels);
  }
}
