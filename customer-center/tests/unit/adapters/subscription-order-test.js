import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Adapter | timed subscription order", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const adapter = this.owner.lookup("adapter:subscription-order");
    assert.ok(adapter);
  });
});
