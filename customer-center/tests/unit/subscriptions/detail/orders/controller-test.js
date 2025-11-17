import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | subscriptions/detail/orders", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const controller = this.owner.lookup(
      "controller:subscriptions/detail/orders"
    );
    assert.ok(controller);
  });

  test("it works", function (assert) {
    const controller = this.owner.lookup(
      "controller:subscriptions/detail/orders"
    );

    const project = {};
    const orders = [];
    orders.links = { next: "..." };

    const model = { project, orders };
    controller.setup(model);

    assert.deepEqual(controller.project, project);

    assert.deepEqual(controller.orders, orders.toArray());
    assert.strictEqual(controller.ordersPage, 1);
    assert.true(controller.ordersNext);
  });
});
