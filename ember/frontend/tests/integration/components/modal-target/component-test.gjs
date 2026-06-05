import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import ModalTarget from "timed/components/modal-target";

module("Integration | Component | ModalTarget", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><ModalTarget /></template>);
    assert.dom("#modals").exists({ count: 1 });
  });
});
