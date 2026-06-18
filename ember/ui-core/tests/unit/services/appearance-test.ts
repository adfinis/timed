import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Service | Appearance", function (hook) {
  setupTest(hook);

  test("it exists", function (assert) {
    const appearanceService = this.owner.lookup("service:appearance");
    assert.ok(appearanceService);
  });

  test("it can change theme and scheme", function (assert) {
    const appearanceService = this.owner.lookup("service:appearance");
    appearanceService.loadConfiguration();
    const defaultTheme = "old";
    assert.strictEqual(defaultTheme, appearanceService.theme);
    appearanceService.setTheme("regular");
    assert.strictEqual(appearanceService.theme, "regular");
    const preferedColor = appearanceService.colorScheme;
    appearanceService.toggleColorScheme();
    const expectedChangeTo = preferedColor === "light" ? "dark" : "light";
    assert.strictEqual(appearanceService.colorScheme, expectedChangeTo);
  });
});
