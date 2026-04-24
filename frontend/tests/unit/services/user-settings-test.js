import { module, test } from "qunit";

import { setupTest } from "timed/tests/helpers";

module("Unit | Service | UserSettings", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:user-settings");
    assert.ok(service);
  });
});
