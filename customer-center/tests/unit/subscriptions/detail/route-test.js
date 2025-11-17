import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | subscriptions/detail", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:subscriptions/detail");
    assert.ok(route);
  });
});
