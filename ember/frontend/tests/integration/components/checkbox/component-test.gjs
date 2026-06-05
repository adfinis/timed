import { fn } from "@ember/helper";
import { click, find, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import Checkbox from "timed/components/checkbox";

module("Integration | Component | checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("works", async function (assert) {
    await render(<template><Checkbox @label="Test Label" /></template>);

    assert.dom("label").hasText("Test Label");
  });

  test("works in block style", async function (assert) {
    await render(
      <template>
        <Checkbox>Test Label</Checkbox>
      </template>,
    );

    assert.dom("label").hasText("Test Label");
  });

  test("changes state", async function (assert) {
    this.set("checked", false);

    await render(
      <template>
        <Checkbox
          @checked={{this.checked}}
          @onChange={{fn (mut this.checked)}}
        />
      </template>,
    );

    assert.dom("input").isNotChecked();
    assert.notOk(this.checked);

    await click("label");

    assert.dom("input").isChecked();
    assert.ok(this.checked);

    await click("label");

    assert.dom("input").isNotChecked();
    assert.notOk(this.checked);
  });

  test("can be indeterminate", async function (assert) {
    this.set("checked", null);

    await render(
      <template>
        <Checkbox
          @checked={{this.checked}}
          @onChange={{fn (mut this.checked)}}
        />
      </template>,
    );

    assert.ok(find("input").indeterminate);
    assert.strictEqual(this.checked, null);

    await click("label");

    // clicking on an indeterminate checkbox makes test checked
    assert.dom("input").isChecked();
    assert.ok(this.checked);
  });
});
