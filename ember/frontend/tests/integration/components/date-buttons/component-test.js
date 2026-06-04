import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module("Integration | Component | date buttons", function (hooks) {
  setupRenderingTest(hooks);

  test("changes the date", async function (assert) {
    this.set("fromDate", null);
    this.set("toDate", null);

    await render(
      hbs`<DateButtons
  @onUpdateFromDate={{fn (mut this.fromDate)}}
  @onUpdateToDate={{fn (mut this.toDate)}}
/>`,
    );

    await click('[data-test-preset-date="0"]');
    assert.strictEqual(
      this.fromDate.toISODate(),
      DateTime.now().startOf("week").toISODate(),
    );
    await click('[data-test-preset-date="1"]');
    assert.strictEqual(
      this.fromDate.toISODate(),
      DateTime.now().startOf("month").toISODate(),
    );
    await click('[data-test-preset-date="2"]');
    assert.strictEqual(
      this.fromDate.toISODate(),
      DateTime.now().startOf("year").toISODate(),
    );
    await click('[data-test-preset-date="3"]');
    assert.strictEqual(
      this.fromDate.toISODate(),
      DateTime.now().minus({ weeks: 1 }).startOf("week").toISODate(),
    );
    assert.strictEqual(
      this.toDate.toISODate(),
      DateTime.now().minus({ weeks: 1 }).endOf("week").toISODate(),
    );
    await click('[data-test-preset-date="4"]');
    assert.strictEqual(
      this.fromDate.toISODate(),
      DateTime.now().minus({ months: 1 }).startOf("month").toISODate(),
    );
    assert.strictEqual(
      this.toDate.toISODate(),
      DateTime.now().minus({ months: 1 }).endOf("month").toISODate(),
    );
    await click('[data-test-preset-date="5"]');
    assert.strictEqual(
      this.fromDate.toISODate(),
      DateTime.now().minus({ years: 1 }).startOf("year").toISODate(),
    );
    assert.strictEqual(
      this.toDate.toISODate(),
      DateTime.now().minus({ years: 1 }).endOf("year").toISODate(),
    );
  });
});
