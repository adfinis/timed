import { module, test } from "qunit";
import { setupRenderingTest } from "../helpers";
import { render } from "@ember/test-helpers";
import Modal from "#src/components/modal.gts";
import { toggle } from "@nullvoxpopuli/ember-composable-helpers";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { click } from "@ember/test-helpers";

module("Integration | Component | modal", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders & is toggleable", async function (assert) {
    class State {
      @tracked visible = false;
    }
    const state = new State();

    await render(
      <template>
        <div id="modals" />
        <button type="button" {{on "click" (toggle "visible" state)}} />
        <Modal
          @visible={{state.visible}}
          @onClose={{toggle "visible" state}}
          class="sm:min-w-[32rem] md:w-auto"
          as |m|
        >
          <m.header><h3>Modal</h3></m.header>
          <m.body>body</m.body>
          <m.footer>bar</m.footer>
        </Modal>
      </template>,
    );

    assert.dom().hasText("");
    await click("button");
    assert.dom().hasText("Modal × body bar");
    await click("button");
    assert.dom().hasText("");
  });
});
