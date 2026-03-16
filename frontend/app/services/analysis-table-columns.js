import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class AnalysisTableColumnsService extends Service {
  localStorageKey = "hidden-analysis-table-column";
  @tracked hiddenColumns = [];
  @tracked allTableColumns = [
    {
      label: "User",
      sortable: true,
      width: 7,
      by: "user__username",
    },
    {
      label: "Date",
      sortable: true,
      width: 7,
      by: "date",
    },
    {
      label: "Duration",
      sortable: true,
      width: 7,
      by: "duration",
    },
    {
      label: "Customer",
      sortable: true,
      width: 10,
      by: "task__project__customer__name",
    },
    {
      label: "Project",
      sortable: true,
      width: 10,
      by: "task__project__name",
    },
    {
      label: "Task",
      sortable: true,
      width: 10,
      by: "task__name",
    },
    {
      label: "Comment",
      sortable: true,
      width: 21,
      by: "comment",
    },
    {
      label: "Verified by",
      sortable: true,
      width: 8,
      by: "verified_by__username",
    },
    {
      label: "Rejected",
      sortable: false,
      width: 5,
    },
    {
      label: "Review",
      sortable: false,
      width: 5,
    },
    {
      label: "Not billable",
      sortable: false,
      width: 5,
    },
    {
      label: "Billed",
      sortable: false,
      width: 5,
    },
  ];

  constructor(...args) {
    super(...args);
    this.loadHiddenColumns();
  }

  get tableColumns() {
    return this.allTableColumns.filter(
      (column) => !this.hiddenColumns.includes(column.label),
    );
  }

  loadHiddenColumns() {
    const hiddenColumnsInLocalStorage = localStorage.getItem(
      this.localStorageKey,
    );
    if (!hiddenColumnsInLocalStorage) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
      return;
    }
    this.hiddenColumns = JSON.parse(hiddenColumnsInLocalStorage);
  }

  @action
  updateHidden(hiddenLabels) {
    this.hiddenColumns = hiddenLabels;
    localStorage.setItem(this.localStorageKey, JSON.stringify(hiddenLabels));
  }
}
