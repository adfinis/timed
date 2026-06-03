import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { Duration } from "luxon";
import { module, test } from "qunit";

import humanizeDuration from "timed/utils/humanize-duration";

module("Integration | Component | statistic list/column", function (hooks) {
  setupRenderingTest(hooks);

  test("renders with default layout", async function (assert) {
    this.set("value", "test");
    await render(
      hbs`<StatisticList::Column @layout="PLAIN" @value={{this.value}} />`,
    );
    assert.dom("td").hasText(this.value);
  });

  test("renders with duration layout", async function (assert) {
    const duration = Duration.fromObject({ hours: 3 });
    this.set("value", duration);
    await render(
      hbs`<StatisticList::Column @layout="DURATION" @value={{this.value}} />`,
    );
    assert.dom("td").hasText(humanizeDuration(duration));
  });

  test("renders with month layout", async function (assert) {
    this.set("value", 6);
    await render(
      hbs`<StatisticList::Column @layout="MONTH" @value={{this.value}} />`,
    );
    assert.dom("td").hasText("June");
  });
});
