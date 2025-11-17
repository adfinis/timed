import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | timed subscription order", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const model = store.createRecord("subscription-order", {});
    assert.ok(model);
  });
});
