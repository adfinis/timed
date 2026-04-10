import AnalysisTableColumn from "./analysis-table-column";

/**
 *
 * @param {UserSettingsService} userSettingsInstance;
 */
export default function userSubServiceLoader(userSettingsInstance) {
  return {
    analysisTable: new AnalysisTableColumn(userSettingsInstance),
  };
}
