/* eslint-disable @typescript-eslint/no-unused-vars */
import { module, test } from "qunit";
import { setupRenderingTest } from "../../helpers";
import Checkbox from "#src/components/checkbox.gts";
import { tracked } from "@glimmer/tracking";
import { click, render } from "@ember/test-helpers";
import { fn } from "@ember/helper";

module("Integration | Component | checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    const nop = (_: boolean) => {};
    await render(
      <template><Checkbox @checked={{true}} @onChange={{nop}} /></template>,
    );

    assert.dom().hasText("");

    await render(
      <template>
        <Checkbox @checked={{true}} @onChange={{nop}}>
          template block text
        </Checkbox>
      </template>,
    );

    assert.dom().hasText("template block text");
  });
  test("changes state", async function (assert) {
    class State {
      @tracked checked = false;
    }
    const state = new State();

    await render(
      <template>
        <Checkbox
          @checked={{state.checked}}
          @onChange={{fn (mut state.checked)}}
        />
      </template>,
    );
    assert.dom("input").isNotChecked();
    assert.false(state.checked);

    await click("label");

    assert.dom("input").isChecked();
    assert.true(state.checked);
  });
});
