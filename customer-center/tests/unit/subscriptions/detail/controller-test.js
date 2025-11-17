import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | subscriptions/detail", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/detail");
    assert.ok(controller);
  });
});
