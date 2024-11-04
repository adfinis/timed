import { findAll } from "@ember/test-helpers";
import uniqBy from "lodash.uniqby";

const uniqueReports = () =>
  uniqBy(findAll("[data-test-report-row]"), (e) => e.dataset.testReportRowId);

const uniqueReportsById = (id) =>
  uniqBy(
    findAll(`[data-test-report-row-id="${id}"]`),
    (e) => e.dataset.testReportRowId
  );

const uniqueReportById = (id) => uniqueReportsById(id)[0];

export { uniqueReports, uniqueReportById, uniqueReportsById };
