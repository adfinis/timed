import { fn } from "@ember/helper";
import { click, render } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import Modal from "timed/components/modal";
import ModalTarget, { TARGET_ID } from "timed/components/modal-target";

module("Integration | Component | Modal", function (hooks) {
  setupRenderingTest(hooks);

  // proper tests for it should be in `ui-core`, this is just a small wrapper

  test("it renders", async function (assert) {
    class State {
      @tracked visible = true;
    }
    const state = new State();

    await render(
      <template>
        <ModalTarget />
        <Modal
          @visible={{state.visible}}
          @onClose={{fn (mut state.visible) false}}
          as |m|
        >
          <m.header />
        </Modal>
      </template>,
    );

    assert.ok(state.visible);

    await click(`#${TARGET_ID} button`);

    assert.notOk(state.visible);
  });
});
