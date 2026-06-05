import { fn } from "@ember/helper";
import {
  click,
  fillIn,
  blur,
  render,
  triggerKeyEvent,
  settled,
} from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { Duration } from "luxon";
import { module, test } from "qunit";

import Durationpicker from "timed/components/durationpicker";
import formatDuration from "timed/utils/format-duration";

module("Integration | Component | durationpicker", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    this.set("value", Duration.fromObject({ hours: 1, minutes: 30 }));

    await render(<template><Durationpicker @value={{this.value}} /></template>);

    assert.dom("input").hasValue("01:30");
  });

  test("renders default duration when none passed", async function (assert) {
    this.set("value", null);

    await render(<template><Durationpicker @value={{this.value}} /></template>);

    assert.dom("input").hasValue("00:00");
  });

  test("focus input on wrapper click", async function (assert) {
    await render(
      <template>
        <Durationpicker>Click me</Durationpicker>
      </template>,
    );
    await click(".extendend-durationpicker-day");

    assert.dom("input").isFocused();
  });

  test("can change the value", async function (assert) {
    this.set(
      "value",
      Duration.fromObject({
        hours: 12,
        minutes: 30,
      }),
    );

    await render(
      <template>
        <Durationpicker
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    await fillIn("input", "13:15");
    await blur("input");

    assert.strictEqual(this.value.hours, 13);
    assert.strictEqual(this.value.minutes, 15);
  });

  test("can set a negative value", async function (assert) {
    this.set(
      "value",
      Duration.fromObject({
        hours: 12,
        minutes: 30,
      }),
    );

    await render(
      <template>
        <Durationpicker
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    await fillIn("input", "-13:00");
    await blur("input");

    assert.strictEqual(this.value.hours, -13);
  });

  test("can't set an invalid value", async function (assert) {
    this.set(
      "value",
      Duration.fromObject({
        hours: 12,
        minutes: 30,
      }),
    );

    await render(
      <template>
        <Durationpicker
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    await fillIn("input", "abcdef");
    await blur("input");

    assert.strictEqual(this.value.hours, 12);
    assert.strictEqual(this.value.minutes, 30);
  });

  test("can increase minutes per arrow", async function (assert) {
    this.set(
      "value",
      Duration.fromObject({
        hours: 12,
        minutes: 15,
      }),
    );

    await render(
      <template>
        <Durationpicker
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 38));

    await settled();

    assert.strictEqual(this.value.hours, 12);
    assert.strictEqual(this.value.minutes, 30);
  });

  test("can decrease minutes per arrow", async function (assert) {
    this.set(
      "value",
      Duration.fromObject({
        hours: 12,
        minutes: 15,
      }),
    );

    await render(
      <template>
        <Durationpicker
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 40));

    await settled();

    assert.strictEqual(this.value.hours, 12);
    assert.strictEqual(this.value.minutes, 0);
  });

  test("can't be bigger than max or smaller than min", async function (assert) {
    this.set(
      "value",
      Duration.fromObject({
        hours: 12,
        minutes: 30,
      }),
    );

    this.set(
      "min",
      Duration.fromObject({
        hours: 12,
        minutes: 30,
      }),
    );

    this.set(
      "max",
      Duration.fromObject({
        hours: 12,
        minutes: 30,
      }),
    );

    await render(
      <template>
        <Durationpicker
          @min={{this.min}}
          @max={{this.max}}
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 38));

    await settled();

    assert.strictEqual(this.value.hours, 12);
    assert.strictEqual(this.value.minutes, 30);

    this.element
      .querySelectorAll("input")
      .forEach(async (element) => await triggerKeyEvent(element, "keyup", 40));

    await settled();

    assert.strictEqual(this.value.hours, 12);
    assert.strictEqual(this.value.minutes, 30);
  });

  test("can set a negative value with minutes", async function (assert) {
    this.set("value", null);

    await render(
      <template>
        <Durationpicker
          @value={{this.value}}
          @onChange={{fn (mut this.value)}}
        />
      </template>,
    );

    await fillIn("input", "-04:30");
    await blur("input");

    assert.strictEqual(this.value.hours, -4);
    assert.strictEqual(this.value.minutes, -30);

    assert.strictEqual(formatDuration(this.value, false), "-04:30");
  });
});
