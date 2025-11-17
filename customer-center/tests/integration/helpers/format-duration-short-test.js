import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | format-duration-short", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    //              hours             minutes
    this.duration = 1000 * 3600 * 2 + 1000 * 60 * 35;

    await render(hbs`{{format-duration-short this.duration}}`);

    assert.dom(this.element).hasText("02:35");
  });
});
