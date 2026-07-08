import { module, test } from "qunit";

import { setupTest } from "timed/tests/helpers";

module("Unit | Service | UserSettings", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const userSettingsService = this.owner.lookup("service:user-settings");
    assert.ok(userSettingsService);
  });

  test("it can update the table columns", function (assert) {
    const userSettingsService = this.owner.lookup("service:user-settings");
    assert.ok(userSettingsService);
    const analysisTable = userSettingsService.getTableColumns("analysis");
    assert.strictEqual(analysisTable.length, 12);
    userSettingsService.updateColumnVisibility(
      "analysis",
      analysisTable[0].label,
      false,
    );
    assert.strictEqual(
      userSettingsService
        .getTableColumns("analysis")
        .filter((label) => label.isVisible).length,
      11,
    );
  });
});
