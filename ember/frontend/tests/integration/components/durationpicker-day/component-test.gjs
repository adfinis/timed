import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import DurationpickerDay from "timed/components/durationpicker-day";

module("Integration | Component | durationpicker day", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><DurationpickerDay /></template>);
    assert.ok(this.element);
  });
});
