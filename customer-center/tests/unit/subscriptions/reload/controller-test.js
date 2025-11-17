import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | subscriptions/reload", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, "en");

  test("it exists", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/reload");
    assert.ok(controller);
  });

  test("it works", function (assert) {
    const controller = this.owner.lookup("controller:subscriptions/reload");

    const project = {};
    const packages = [];

    const model = { project, packages };
    controller.setup(model);

    assert.deepEqual(controller.project, project);
    assert.deepEqual(controller.packages, packages);

    assert.strictEqual(controller.changeset.get("hours"), 0);
    assert.strictEqual(controller.changeset.get("minutes"), 0);
  });
});
