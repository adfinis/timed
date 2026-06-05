import { click, render, triggerKeyEvent } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import Toggle from "timed/components/toggle";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";

module("Integration | Component | Toggle", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set("noop", () => {});
  });

  test("it renders", async function (assert) {
    await render(<template><Toggle @icon="eye" @onToggle={{this.noop}} /></template>);

    assert.dom(this.element).hasText("");
    assert.dom(".toggle .fa-eye").exists();

    // Template block usage:
    await render(<template><Toggle @onToggle={{this.noop}}>
  template block text
</Toggle></template>);

    assert.dom(this.element).hasText("template block text");
    assert.dom(".toggle .fa-eye").doesNotExist();
  });

  test("it toggles", async function (assert) {
    this.set("value", true);

    await render(
      <template><Toggle @icon="eye" @value={{this.value}} @onToggle={{toggle "value" this}} /></template>,
    );

    assert.dom(".toggle").hasClass("active");

    await click(".toggle");

    assert.dom(".toggle").hasClass("inactive");

    await triggerKeyEvent(".toggle", "keyup", 32);

    assert.dom(".toggle").hasClass("active");
  });

  test("it includes the hint", async function (assert) {
    this.set("disabled", false);
    await render(
      <template><Toggle @icon="eye" @hint="test" @disabled={{this.disabled}} @onToggle={{this.noop}} /></template>,
    );

    assert.dom(".toggle").hasAttribute("title", "test");

    this.set("disabled", true);

    assert.dom(".toggle").hasAttribute("title", "test (disabled)");
  });
});
