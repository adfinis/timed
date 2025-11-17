import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | sub-nav/item", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<SubNav::Item />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <SubNav::Item>
        template block text
      </SubNav::Item>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
