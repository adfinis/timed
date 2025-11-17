import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | notify", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:notify");
    assert.ok(service);
  });
});
