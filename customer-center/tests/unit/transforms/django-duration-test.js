import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Transform | django duration", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const transform = this.owner.lookup("transform:django-duration");
    assert.ok(transform);
  });
});
