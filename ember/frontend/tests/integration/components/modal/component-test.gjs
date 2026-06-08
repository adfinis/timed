import { fn } from "@ember/helper";
import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import Modal from "timed/components/modal";
import ModalTarget from "timed/components/modal-target";

module("Integration | Component | Modal", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <Modal @visible={{true}} as |m|>
          <m.header>
            Header
          </m.header>
          <m.body>
            Body
          </m.body>
          <m.footer>
            Footer
          </m.footer>
        </Modal>
      </template>,
    );

    assert.dom("#modals > *").exists({ count: 1 });

    assert.dom("#modals .modal-header").hasText("Header ×");
    assert.dom("#modals .modal-body").includesText("Body");
    assert.dom("#modals .modal-footer").includesText("Footer");
  });

  test("closes on click of the close icon", async function (assert) {
    this.set("visible", true);

    await render(
      <template>
        <ModalTarget />
        <Modal
          @visible={{this.visible}}
          @onClose={{fn (mut this.visible) false}}
          as |m|
        >
          <m.header />
        </Modal>
      </template>,
    );

    assert.ok(this.visible);

    await click("#modals .modal-header button");

    assert.notOk(this.visible);
  });
});
