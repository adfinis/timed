import { click, find, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("works", async function (assert) {
    await render(hbs`<Checkbox @label='Test Label' />`);

    assert.dom("label").hasText("Test Label");
  });

  test("works in block style", async function (assert) {
    await render(hbs`<Checkbox>Test Label</Checkbox>`);

    assert.dom("label").hasText("Test Label");
  });

  test("changes state", async function (assert) {
    this.set("checked", false);

    await render(
      hbs`<Checkbox @checked={{this.checked}} @onChange={{fn (mut this.checked)}} />`,
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
      hbs`<Checkbox @checked={{this.checked}} @onChange={{fn (mut this.checked)}} />`,
    );

    assert.ok(find("input").indeterminate);
    assert.strictEqual(this.checked, null);

    await click("label");

    // clicking on an indeterminate checkbox makes test checked
    assert.dom("input").isChecked();
    assert.ok(this.checked);
  });
});
