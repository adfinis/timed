import AnalysisTableColumn from "./analysis-table-column";
import Appearance from "./appearance";

/**
 *
 * @param {UserSettingsService} userSettingsInstance;
 */
export default function userSubServiceLoader(userSettingsInstance) {
  return {
    analysisTable: new AnalysisTableColumn(userSettingsInstance),
    appearance: new Appearance(userSettingsInstance),
  };
}
