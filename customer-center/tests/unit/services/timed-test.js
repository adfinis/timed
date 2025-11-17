import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | timed", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:timed");
    assert.ok(service);
  });
});
