import { click, find, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime, Duration } from "luxon";
import { module, test } from "qunit";

module("Integration | Component | weekly overview day", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("day", DateTime.fromObject({ year: 2017, month: 1, day: 5 }));
    this.set("expected", Duration.fromObject({ hours: 8 }));
    this.set("worktime", Duration.fromObject({ hours: 8 }));

    await render(
      hbs`<WeeklyOverviewDay
  @day={{this.day}}
  @expected={{this.expected}}
  @worktime={{this.worktime}}
/>`,
    );

    assert.ok(this.element);

    assert.strictEqual(find(".day").textContent.trim(), "05\n    Th");
  });

  test("computes a title", async function (assert) {
    this.set("day", DateTime.fromObject({ year: 2017, month: 1, day: 5 }));
    this.set("expected", Duration.fromObject({ hours: 8, minutes: 30 }));
    this.set("worktime", Duration.fromObject({ hours: 8, minutes: 30 }));

    await render(
      hbs`<WeeklyOverviewDay
  @day={{this.day}}
  @expected={{this.expected}}
  @worktime={{this.worktime}}
  @prefix="Ferien"
/>`,
    );

    assert
      .dom(this.element.firstElementChild)
      .hasAttribute("title", "Ferien, 8h 30m");
  });

  test("fires on-click action on click", async function (assert) {
    this.set("day", DateTime.fromObject({ year: 2017, month: 1, day: 5 }));
    this.set("expected", Duration.fromObject({ hours: 8, minutes: 30 }));
    this.set("worktime", Duration.fromObject({ hours: 8, minutes: 30 }));
    this.set("clicked", false);

    await render(
      hbs`<WeeklyOverviewDay
  @day={{this.day}}
  @expected={{this.expected}}
  @worktime={{this.worktime}}
/>`,
    );

    assert.notOk(this.clicked);
    await click(".bar");
    await click(".day");
    assert.notOk(this.clicked);

    await render(
      hbs`<WeeklyOverviewDay
  @day={{this.day}}
  @expected={{this.expected}}
  @worktime={{this.worktime}}
  @onClick={{fn (mut this.clicked) true}}
/>`,
    );

    assert.notOk(this.clicked);

    await click(".bar");

    assert.ok(this.clicked);

    this.set("clicked", false);

    assert.notOk(this.clicked);

    await click(".day");

    assert.ok(this.clicked);
  });
});
