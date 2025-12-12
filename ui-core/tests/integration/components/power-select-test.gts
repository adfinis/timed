import { module, test } from "qunit";
import { setupRenderingTest } from "dummy/tests/helpers";
import { render } from "@ember/test-helpers";
import PowerSelect from "ui-core/components/power-select";
import { get } from "@ember/helper";

module("Integration | Component | powerselect", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    const nop = () => {};

    const things = ["foo", "bar", "baz"];

    await render(
      <template>
        <PowerSelect
          @options={{things}}
          @selected={{get things 0}}
          @onChange={{nop}}
        />
      </template>,
    );

    assert.dom().hasText("");

    await render(
      <template>
        <PowerSelect
          @options={{things}}
          @selected={{get things 0}}
          @onChange={{nop}}
          as |thing|
        >{{thing}}</PowerSelect>
      </template>,
    );

    assert.dom().hasText("foo");
  });
});
