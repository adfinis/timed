import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Adapter | timed billing type", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const adapter = this.owner.lookup("adapter:billing-type");
    assert.ok(adapter);
  });
});
