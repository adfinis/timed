import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import Label from "timed/components/filter-sidebar/label";

module("Integration | Component | filter sidebar/label", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><Label>
  Some label
</Label></template>);

    assert.dom("label").exists();
    assert.dom("label").hasText("Some label");
  });
});
