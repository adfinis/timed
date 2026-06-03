import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

const DATE = DateTime.fromObject({ year: 2017, month: 1, day: 10 });

module("Integration | Component | date navigation", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`,
    );

    assert.strictEqual(this.date.toISODate(), "2017-01-10");
  });

  test("can select the next day", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`,
    );

    await click("[data-test-next]");

    assert.strictEqual(this.date.toISODate(), "2017-01-11");
  });

  test("can select the previous day", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`,
    );

    await click("[data-test-previous]");

    assert.strictEqual(this.date.toISODate(), "2017-01-09");
  });

  test("can select the current day", async function (assert) {
    this.set("date", DATE);

    await render(
      hbs`<DateNavigation @current={{this.date}} @onChange={{fn (mut this.date)}} />`,
    );

    await click("[data-test-today]");

    assert.strictEqual(this.date.toISODate(), DateTime.now().toISODate());
  });
});
