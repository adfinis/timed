import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | Modal::Overlay", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<Modal::Overlay />`);
    assert.ok(this.element);
  });

  test("closes on click", async function (assert) {
    this.set("visible", true);
    this.set("closeAction", () => this.set("visible", false));

    await render(hbs`
      <Modal::Overlay
        @visible={{this.visible}}
        @onClose={{this.closeAction}}
      />
    `);

    assert.ok(this.visible);

    await click(".modal");

    assert.notOk(this.visible);
  });

  test("does not close on click of a child element", async function (assert) {
    this.set("visible", true);
    this.set("closeAction", () => this.set("visible", false));

    await render(hbs`
      <Modal::Overlay @visible={{this.visible}} @onClose={{this.closeAction}}>
        <div id="some-child">Test</div>
      </Modal::Overlay>
    `);

    assert.ok(this.visible);

    await click("#some-child");

    assert.ok(this.visible);
  });
});
