import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { DateTime, Duration } from "luxon";
import { module, test } from "qunit";
import WeeklyOverview from "timed/components/weekly-overview";
import WeeklyOverviewDay from "timed/components/weekly-overview-day";

module("Integration | Component | weekly overview", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("expected", Duration.fromObject({ hours: 8 }));

    await render(<template><WeeklyOverview @expected={{this.expected}} /></template>);

    assert.ok(this.element);
  });

  test("renders the benchmarks", async function (assert) {
    this.set("expected", Duration.fromObject({ hours: 8 }));

    await render(<template><WeeklyOverview @expected={{this.expected}} /></template>);

    // 11 (evens from 0 to 20) plus the expected
    assert.dom("hr").exists({ count: 12 });
  });

  test("renders the days", async function (assert) {
    this.set("day", DateTime.now());
    this.set("expected", Duration.fromObject({ hours: 8 }));
    this.set("worktime", Duration.fromObject({ hours: 8 }));

    await render(<template><WeeklyOverview @expected={{this.expected}}>
  <WeeklyOverviewDay @day={{this.day}} @expected={{this.expected}} @worktime={{this.worktime}} />
</WeeklyOverview></template>);

    assert.dom(".bar").exists();
  });
});
