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
    // check if analysis table have 12 columns
    assert.strictEqual(analysisTable.length, 12);
    // remove one
    userSettingsService.updateColumnVisibility(
      "analysis",
      analysisTable[0].label,
      false,
    );
    // now it should be 11 columns
    assert.strictEqual(
      userSettingsService
        .getTableColumns("analysis")
        .filter((label) => label.isVisible).length,
      11,
    );
  });

  test("it can change theme and scheme", function (assert) {
    const userSettingsService = this.owner.lookup("service:user-settings");
    assert.ok(userSettingsService);
    const defaultTheme = "old";
    assert.strictEqual(defaultTheme, userSettingsService.theme);
    userSettingsService.setTheme("regular");
    assert.strictEqual(userSettingsService.theme, "regular");
    const colorScheme = ["dark", "light"];
    // since it's checking prefers color scheme in the browser, then it depend on the test machine
    assert.strictEqual(
      colorScheme.includes(userSettingsService.colorScheme),
      true,
    );
    const preferedColor = userSettingsService.colorScheme;
    userSettingsService.toggleColorScheme();
    const expectedChangeTo = preferedColor === "light" ? "dark" : "light";
    assert.strictEqual(userSettingsService.colorScheme, expectedChangeTo);
  });
});
