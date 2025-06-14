import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | welcome modal", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    await render(hbs`<ModalTarget />
<WelcomeModal @visible={{true}} />`);
    assert.ok(this.element);
  });
});
