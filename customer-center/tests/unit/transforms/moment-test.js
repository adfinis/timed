import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Transform | moment", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const transform = this.owner.lookup("transform:moment");
    assert.ok(transform);
  });
});
