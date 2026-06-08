import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import NoMobileMessage from "timed/components/no-mobile-message";
import { setupMirage } from "timed/tests/helpers/mirage";

module("Integration | Component | no mobile message", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    await render(<template><NoMobileMessage /></template>);
    assert.ok(this.element);
  });
});
