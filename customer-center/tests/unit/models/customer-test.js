import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | timed customer", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const store = this.owner.lookup("service:store");
    const model = store.createRecord("customer", {});
    assert.ok(model);
  });
});
