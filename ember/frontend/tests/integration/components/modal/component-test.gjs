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

  test("it renders into the default target when no @targetId is given", async function (assert) {
    class State {
      @tracked visible = true;
    }
    const state = new State();

    await render(
      <template>
        <ModalTarget />
        <div id="custom-target"></div>
        <Modal
          @visible={{state.visible}}
          @onClose={{fn (mut state.visible) false}}
          data-test-my-modal
          as |m|
        >
          <m.header />
        </Modal>
      </template>,
    );

    assert
      .dom(`#${TARGET_ID} [data-test-my-modal]`)
      .exists("renders inside the default modal target");
    assert
      .dom("#custom-target [data-test-my-modal]")
      .doesNotExist("does not render into an unrelated element");
  });

  test("it renders into a custom target when @targetId is given", async function (assert) {
    class State {
      @tracked visible = true;
    }
    const state = new State();

    await render(
      <template>
        <ModalTarget />
        <div id="custom-target"></div>
        <Modal
          @visible={{state.visible}}
          @onClose={{fn (mut state.visible) false}}
          @targetId="custom-target"
          data-test-my-modal
          as |m|
        >
          <m.header />
        </Modal>
      </template>,
    );

    assert
      .dom("#custom-target [data-test-my-modal]")
      .exists("renders inside the given @targetId element");
    assert
      .dom(`#${TARGET_ID} [data-test-my-modal]`)
      .doesNotExist("does not fall back to the default modal target");
  });
});
