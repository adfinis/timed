import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import Checkmark from "timed/components/checkmark";

module("Integration | Component | checkmark", function (hooks) {
  setupRenderingTest(hooks);

  test("works unchecked", async function (assert) {
    await render(<template><Checkmark @checked={{false}} /></template>);
    assert.dom(".fa-square").exists({ count: 1 });
  });

  test("works checked", async function (assert) {
    await render(<template><Checkmark @checked={{true}} /></template>);
    assert.dom(".fa-square-check").exists({ count: 1 });
  });

  test("works highlight", async function (assert) {
    await render(
      <template><Checkmark @checked={{true}} @highlight={{true}} /></template>,
    );
    assert.dom(".fa-square-check").exists({ count: 1 });
    assert.dom(".highlight").exists({ count: 1 });
  });
});
