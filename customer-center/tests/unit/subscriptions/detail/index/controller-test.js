import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | subscriptions/detail/index", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const controller = this.owner.lookup(
      "controller:subscriptions/detail/index"
    );
    assert.ok(controller);
  });

  test("it works", function (assert) {
    const controller = this.owner.lookup(
      "controller:subscriptions/detail/index"
    );

    const project = {};
    const reports = [];
    reports.links = { next: "..." };

    const model = { project, reports };
    controller.setup(model);

    assert.deepEqual(controller.project, project);

    assert.deepEqual(controller.reports, reports.toArray());
    assert.strictEqual(controller.reportsPage, 1);
    assert.true(controller.reportsNext);
  });
});
