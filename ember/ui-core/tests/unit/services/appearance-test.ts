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
    assert.ok(appearanceService);
    appearanceService.loadConfiguration();
    const defaultTheme = "old";
    assert.strictEqual(defaultTheme, appearanceService.theme);
    appearanceService.setTheme("regular");
    assert.strictEqual(appearanceService.theme, "regular");
    const colorScheme = ["dark", "light"];
    // since it's checking prefers color scheme in the browser, then it depend on the test machine
    assert.strictEqual(
      colorScheme.includes(appearanceService.colorScheme),
      true,
    );
    const preferedColor = appearanceService.colorScheme;
    appearanceService.toggleColorScheme();
    const expectedChangeTo = preferedColor === "light" ? "dark" : "light";
    assert.strictEqual(appearanceService.colorScheme, expectedChangeTo);
  });
});
