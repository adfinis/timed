import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | error", function (hooks) {
  setupTest(hooks);

  test("it shows stack in testing", function (assert) {
    const controller = this.owner.lookup("controller:error");
    assert.true(controller.showStack);
  });
});
