import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import NoPermission from "timed/components/no-permission";

module("Integration | Component | no permission", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><NoPermission /></template>);

    assert.dom(".empty").exists();
    assert.dom(".empty").includesText("Halt");
  });
});
