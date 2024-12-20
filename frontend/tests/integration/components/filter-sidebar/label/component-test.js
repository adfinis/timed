import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | filter sidebar/label", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(hbs`<FilterSidebar::Label>
  Some label
</FilterSidebar::Label>`);

    assert.dom("label").exists();
    assert.dom("label").hasText("Some label");
  });
});
