import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import LoadingIcon from "timed/components/loading-icon";

module("Integration | Component | loading icon", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><LoadingIcon /></template>);

    assert.dom(".loading-dot").exists({ count: 9 });
  });
});
