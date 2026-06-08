import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ModalTarget from "timed/components/modal-target";
import WelcomeModal from "timed/components/welcome-modal";
import { setupMirage } from "timed/tests/helpers/mirage";

module("Integration | Component | welcome modal", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <WelcomeModal @visible={{true}} />
      </template>,
    );
    assert.ok(this.element);
  });
});
