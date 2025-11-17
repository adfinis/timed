import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | subscriptions/confirm", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/confirm");
    assert.ok(controller);
  });

  test("it works", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/confirm");

    const expected = [];
    controller.model = expected;

    assert.deepEqual(controller.orders, expected);
  });
});
