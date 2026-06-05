import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import Footer from "timed/components/modal/footer";

module("Integration | Component | Modal::Footer", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(
      <template>
        <Footer>Test</Footer>
      </template>,
    );

    assert.dom(this.element).hasText("Test");
  });
});
