import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import NotIdenticalWarning from "timed/components/not-identical-warning";

module("Integration | Component | not identical warning", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><NotIdenticalWarning /></template>);

    assert.dom(".fa-circle-info").exists();
  });
});
