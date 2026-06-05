import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import Group from "timed/components/filter-sidebar/group";

module("Integration | Component | filter sidebar/group", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><Group @label="Group">
  Group content
</Group></template>);

    assert.dom(".filter-sidebar-group-label").includesText("Group");
    assert.dom(".filter-sidebar-group-body").includesText("Group content");
  });

  test("can be toggled", async function (assert) {
    await render(<template><Group @label="Group">
  Group content
</Group></template>);

    assert.dom(".filter-sidebar-group--expanded").doesNotExist();

    await click(".filter-sidebar-group-label");

    assert.dom(".filter-sidebar-group--expanded").exists();

    await click(".filter-sidebar-group-label");

    assert.dom(".filter-sidebar-group--expanded").doesNotExist();
  });
});
