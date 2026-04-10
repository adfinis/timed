import { tracked } from "@glimmer/tracking";

export default class TableColumnHelper {
  storageKey;
  userSettings;
  @tracked hiddenColumns = [];
  allTableColumns = [];

  prepare(userSettings, allTableColumns, storageKey) {
    if (!Array.isArray(allTableColumns) || !allTableColumns.length) {
      console.error(
        `${this.constructor.name} class is not configured correctly to use TableColumnHelper`,
      );
      return;
    }
    this.userSettings = userSettings;
    this.allTableColumns = allTableColumns;
    this.storageKey = storageKey;
    this.loadHiddenColumns();
  }

  get tableColumns() {
    return this.allTableColumns.filter(
      (column) => !this.hiddenColumns.includes(column.label),
    );
  }

  loadHiddenColumns() {
    this.hiddenColumns = this.userSettings.load(this.storageKey, []);
  }

  updateHidden(hiddenLabels) {
    this.hiddenColumns = hiddenLabels;
    this.userSettings.save(this.storageKey, hiddenLabels);
  }
}
