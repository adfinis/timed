import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime, Duration } from "luxon";
import { module, test } from "qunit";

import WorktimeBalanceChart from "timed/components/worktime-balance-chart";

module("Integration | Component | worktime balance chart", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const testContext = this;
    this.owner.register(
      "component:worktime-balance-chart",
      class extends WorktimeBalanceChart {
        constructor(owner, args) {
          super(owner, args);
          testContext.component = this;
        }
      },
    );
  });

  test("computes the data correctly", async function (assert) {
    const dates = [...new Array(3).keys()].map((i) =>
      DateTime.now().minus({ days: i }),
    );
    this.set(
      "data",
      dates.map((date) => ({
        balance: Duration.fromObject({ hours: 10 }),
        date,
      })),
    );

    await render(hbs`<WorktimeBalanceChart @worktimeBalances={{this.data}} />`);
    assert.ok(this.element);

    assert.deepEqual(
      this.component.data.labels.map((l) => l.toISODate()),
      dates.map((d) => d.toISODate()),
    );

    assert.deepEqual(this.component.data.datasets, [{ data: [10, 10, 10] }]);
  });

  test("computes tooltip correctly", async function (assert) {
    await render(hbs`<WorktimeBalanceChart />`);

    const titleFn = this.component.options.tooltips.callbacks.title;
    const labelFn = this.component.options.tooltips.callbacks.label;

    assert.strictEqual(
      titleFn([{ index: 0 }], { labels: [DateTime.now()] }),
      DateTime.now().toFormat("dd.MM.yyyy"),
    );
    assert.strictEqual(labelFn({ yLabel: 10.5 }), "10h 30m");
  });
});
