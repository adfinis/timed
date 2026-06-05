import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import Body from "timed/components/modal/body";

module("Integration | Component | Modal::Body", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><Body>Test</Body></template>);

    assert.dom(this.element).hasText("Test");
  });
});
