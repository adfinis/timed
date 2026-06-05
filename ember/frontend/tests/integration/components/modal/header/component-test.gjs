import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import Header from "timed/components/modal/header";
import { fn } from "@ember/helper";

module("Integration | Component | Modal::Header", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("visible", true);

    await render(<template><Header @close={{fn (mut this.visible) false}}>
  Test
</Header></template>);

    assert.dom(this.element).hasText("Test ×");
  });

  test("closes on click of the close icon", async function (assert) {
    this.set("visible", true);

    await render(<template><Header @close={{fn (mut this.visible) false}}>
  Test
</Header></template>);

    assert.ok(this.visible);

    await click("button");

    assert.notOk(this.visible);
  });
});
