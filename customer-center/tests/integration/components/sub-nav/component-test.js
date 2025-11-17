import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | sub-nav", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<SubNav />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <SubNav>
        template block text
      </SubNav>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
