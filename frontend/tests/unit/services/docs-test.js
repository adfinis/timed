import { setupTest } from "timed/tests/helpers";
import { module, test } from "qunit";

module("Unit | Service | docs", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:docs");
    assert.ok(service);
  });
});
