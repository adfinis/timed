import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | subscriptions/list", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/list");
    assert.ok(controller);
  });

  test("it works", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/list");

    const model = [];
    controller.setup(model);

    assert.deepEqual(controller.projects, model);
    assert.deepEqual(controller._projects, model);
  });
});
