import { find, triggerEvent, click, render } from "@ember/test-helpers";
import { clickTrigger } from "ember-basic-dropdown/test-support/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module("Integration | Component | datepicker", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("value", DateTime.now());

    await render(
      hbs`<Datepicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`,
    );

    assert.dom("input").hasValue(DateTime.now().toFormat("dd.MM.yyyy"));
  });

  test("toggles the calendar on click of the input", async function (assert) {
    this.set("value", DateTime.now());

    await render(
      hbs`<Datepicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`,
    );

    assert.dom(".datepicker").doesNotExist();

    await clickTrigger();

    assert.dom(".datepicker").exists();
  });

  test("validates the input", async function (assert) {
    this.set("value", null);

    await render(
      hbs`<Datepicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`,
    );

    assert.ok(find("input").validity.valid);

    find("input").value = "20.20.20";
    await triggerEvent("input", "input");

    assert.notOk(find("input").validity.valid);

    find("input").value = "20.12.2020";
    await triggerEvent("input", "input");

    assert.ok(find("input").validity.valid);
  });

  test("changes value on change (input)", async function (assert) {
    this.set("value", DateTime.now());

    await render(
      hbs`<Datepicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`,
    );

    find("input").value = "1.2.2018";
    await triggerEvent("input", "change");

    assert.strictEqual(this.value.toISODate(), "2018-02-01");

    find("input").value = "";
    await triggerEvent("input", "change");

    assert.strictEqual(this.value, null);

    find("input").value = "somewrongthing";
    await triggerEvent("input", "change");

    // value stays unchanged
    assert.strictEqual(this.value, null);
  });

  test("changes value on selection", async function (assert) {
    this.set("value", DateTime.now());

    await render(
      hbs`<Datepicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`,
    );

    await clickTrigger();
    await click(
      ".ember-power-calendar-day-grid .ember-power-calendar-row:last-child .ember-power-calendar-day:last-child",
    );

    const expected = DateTime.now().endOf("month").endOf("week");

    assert.ok(this.value.hasSame(expected, "day"));
  });

  test("toggles the calendar on focus and blur of the input", async function (assert) {
    this.set("value", DateTime.now());

    await render(
      hbs`<Datepicker @value={{this.value}} @onChange={{fn (mut this.value)}} />`,
    );

    assert.dom(".datepicker").doesNotExist();

    // show if focus is on input
    await triggerEvent("input", "focus");
    assert.dom(".datepicker").exists();

    // do not hide if focus changed into the picker
    await triggerEvent("input", "blur", {
      relatedTarget: find(".datepicker"),
    });
    assert.dom(".datepicker").exists();

    // hide if focus changed into another element
    await triggerEvent("input", "blur");
    assert.dom(".datepicker").doesNotExist();
  });
});
