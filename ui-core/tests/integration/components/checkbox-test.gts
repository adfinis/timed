import { module, test } from "qunit";
import { setupRenderingTest } from "dummy/tests/helpers";
import { render } from "@ember/test-helpers";
import Checkbox from "ui-core/components/checkbox";
import { tracked } from "@glimmer/tracking";
import { click } from "@ember/test-helpers";
import { fn } from "@ember/helper";
import { find } from "@ember/test-helpers";

module("Integration | Component | checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nop = (_: boolean) => {};
    await render(
      <template><Checkbox @checked={{true}} @onChange={{nop}} /></template>,
    );

    assert.dom().hasText("");

    // Template block usage:
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

  test("can be indeterminate", async function (assert) {
    class State {
      @tracked
      checked: boolean | null = null;
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
    assert.true(find("input")?.indeterminate);

    await click("label");

    assert.dom("input").isChecked();
    assert.true(state.checked);
  });
});
