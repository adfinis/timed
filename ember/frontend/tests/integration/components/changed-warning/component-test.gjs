import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ChangedWarning from "timed/components/changed-warning";

module("Integration | Component | changed warning", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><ChangedWarning /></template>);

    assert.dom(".fa-triangle-exclamation").exists();
  });
});
