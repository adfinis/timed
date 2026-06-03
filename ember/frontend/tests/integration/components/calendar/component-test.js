import { render, select } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module("Integration | Component | calendar", function (hooks) {
  setupRenderingTest(hooks);

  test("can select a year", async function (assert) {
    assert.expect(1);
    this.set("center", DateTime.fromObject({ year: 2017, month: 1, day: 7 }));
    this.set("onCenterChangeHandler", (value) => {
      this.center = value.datetime;
    });

    await render(hbs`<Calendar
  @center={{this.center}}
  @onCenterChange={{this.onCenterChangeHandler}}
/>`);

    await select(".nav-select-year select", "2010");

    assert.strictEqual(this.center.year, 2010);
  });

  test("can select a month", async function (assert) {
    assert.expect(1);
    this.set("center", DateTime.fromObject({ year: 2017, month: 1, day: 7 }));
    this.set("onCenterChangeHandler", (value) => {
      this.center = value.datetime;
    });

    await render(hbs`<Calendar
  @center={{this.center}}
  @onCenterChange={{this.onCenterChangeHandler}}
/>`);

    const element = document.querySelector(".nav-select-month select");

    const toSelect = Array.from(element.options).find(
      (option) => option.text.trim() === "May",
    );

    await select(element, toSelect.value);

    assert.strictEqual(this.center.month, 5);
  });
});
