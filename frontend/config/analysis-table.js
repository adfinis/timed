/**
 * if you are changing the width classes,
 * don't forget to update frontend/config/tailwind.config.js
 * since tailwind is not detecting the classes in config file
 */
module.exports = [
  {
    label: "User",
    sortable: true,
    widthClass: "w-[7%]",
    by: "user__username",
  },
  {
    label: "Date",
    sortable: true,
    widthClass: "w-[7%]",
    by: "date",
  },
  {
    label: "Duration",
    sortable: true,
    widthClass: "w-[7%]",
    by: "duration",
  },
  {
    label: "Customer",
    sortable: true,
    widthClass: "w-[10%]",
    by: "task__project__customer__name",
  },
  {
    label: "Project",
    sortable: true,
    widthClass: "w-[10%]",
    by: "task__project__name",
  },
  {
    label: "Task",
    sortable: true,
    widthClass: "w-[10%]",
    by: "task__name",
  },
  {
    label: "Comment",
    sortable: true,
    widthClass: "w-[21%]",
    by: "comment",
  },
  {
    label: "Verified by",
    sortable: true,
    widthClass: "w-[8%]",
    by: "verified_by__username",
  },
  {
    label: "Rejected",
    sortable: false,
    widthClass: "w-[5%]",
  },
  {
    label: "Review",
    sortable: false,
    widthClass: "w-[5%]",
  },
  {
    label: "Not billable",
    sortable: false,
    widthClass: "w-[5%]",
  },
  {
    label: "Billed",
    sortable: false,
    widthClass: "w-[5%]",
  },
];
