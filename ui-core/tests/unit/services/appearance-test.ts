import { module, test } from "qunit";
import { setupTest } from "dummy/tests/helpers";

module("Unit | Service | appearance", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:appearance");
    assert.ok(service);
  });
});
