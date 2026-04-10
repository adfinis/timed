import TableColumnHelper from "./table-column-helper";

export default class AnalysisTableColumn extends TableColumnHelper {
  constructor(userSettings) {
    super();
    const allTableColumns = [
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
    this.prepare(userSettings, allTableColumns);
  }
}
