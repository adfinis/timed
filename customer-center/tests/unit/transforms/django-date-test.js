import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Transform | django date", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const transform = this.owner.lookup("transform:django-date");
    assert.ok(transform);
  });
});
