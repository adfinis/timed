import { find, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import WeeklyOverviewBenchmark from "timed/components/weekly-overview-benchmark";

module("Integration | Component | weekly overview benchmark", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(
      <template><WeeklyOverviewBenchmark @hours={{20}} /></template>,
    );

    assert.ok(this.element);
  });

  test("computes the position correctly", async function (assert) {
    await render(
      <template>
        <WeeklyOverviewBenchmark @hours={{10}} @max={{10}} />
      </template>,
    );

    assert.strictEqual(find("hr").getAttribute("style"), "bottom: calc(100%);");
  });

  test("shows labels only when permitted", async function (assert) {
    await render(
      <template>
        <WeeklyOverviewBenchmark @showLabel={{true}} @hours={{8.5}} />
      </template>,
    );

    assert.strictEqual(find("span").textContent, "8.5h");
  });
});
