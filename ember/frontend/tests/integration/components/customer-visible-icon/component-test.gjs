import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import CustomerVisibleIcon from "timed/components/customer-visible-icon";

module("Integration | Component | customer visible icon", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><CustomerVisibleIcon /></template>);

    assert.dom(".fa-eye").exists();
  });
});
