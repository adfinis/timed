import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Adapter | timed user", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const adapter = this.owner.lookup("adapter:user");
    assert.ok(adapter);
  });
});
