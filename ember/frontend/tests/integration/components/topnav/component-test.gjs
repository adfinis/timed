import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import Topnav from "timed/components/topnav";
import { setupMirage } from "timed/tests/helpers/mirage";

module("Integration | Component | Topnav", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    await render(<template><Topnav /></template>);
    assert.ok(this.element);
  });
});
