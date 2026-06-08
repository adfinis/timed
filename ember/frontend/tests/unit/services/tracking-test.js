import { settled } from "@ember/test-helpers";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import { setupMirage } from "timed/tests/helpers/mirage";

module("Unit | Service | tracking", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("exists", async function (assert) {
    const service = this.owner.lookup("service:tracking");
    await settled();
    assert.ok(service);
  });
});
