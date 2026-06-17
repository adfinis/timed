import { module, test } from "qunit";
import { setupRenderingTest } from "../../helpers";
import { render } from "@ember/test-helpers";
import LoadingIcon from "#src/components/loading-icon.gts";

module("Integration | Component | loading-icon", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(<template><LoadingIcon /></template>);

    assert.dom("[data-test-loading-dot]").exists({ count: 9 });
  });
});
