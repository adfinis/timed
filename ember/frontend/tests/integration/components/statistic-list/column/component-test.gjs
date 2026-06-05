import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { Duration } from "luxon";
import { module, test } from "qunit";
import humanizeDuration from "timed/utils/humanize-duration";
import Column from "timed/components/statistic-list/column";

module("Integration | Component | statistic list/column", function (hooks) {
  setupRenderingTest(hooks);

  test("renders with default layout", async function (assert) {
    this.set("value", "test");
    await render(
      <template><Column @layout="PLAIN" @value={{this.value}} /></template>,
    );
    assert.dom("td").hasText(this.value);
  });

  test("renders with duration layout", async function (assert) {
    const duration = Duration.fromObject({ hours: 3 });
    this.set("value", duration);
    await render(
      <template><Column @layout="DURATION" @value={{this.value}} /></template>,
    );
    assert.dom("td").hasText(humanizeDuration(duration));
  });

  test("renders with month layout", async function (assert) {
    this.set("value", 6);
    await render(
      <template><Column @layout="MONTH" @value={{this.value}} /></template>,
    );
    assert.dom("td").hasText("June");
  });
});
