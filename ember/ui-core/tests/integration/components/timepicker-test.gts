import { module, test } from "qunit";
import { setupRenderingTest } from "../../helpers";
import {
  fillIn,
  render,
  triggerEvent,
  triggerKeyEvent,
} from "@ember/test-helpers";
import Timepicker from "#src/components/ui-timepicker.gts";
import { Duration, DateTime } from "luxon";
import { fn } from "@ember/helper";
import { tracked } from "@glimmer/tracking";

module("Integration | Component | timepicker", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    class State {
      @tracked time = DateTime.fromObject({
        hour: 1,
        minute: 10,
      }) as DateTime | null;
    }

    const state = new State();

    await render(
      <template>
        <Timepicker @value={{state.time}} @onChange={{fn (mut state.time)}} />
      </template>,
    );

    assert.dom("input").hasValue("01:10");
  });

  test("it handles events", async function (assert) {
    const step = Duration.fromObject({ minutes: 10 });
    const bigStep = Duration.fromObject({ hour: 1 });

    class State {
      @tracked time = DateTime.fromObject({
        hour: 0,
        minute: 10,
      }) as DateTime | null;
    }

    const state = new State();

    await render(
      <template>
        <Timepicker
          @value={{state.time}}
          @step={{step}}
          @bigStep={{bigStep}}
          @onChange={{fn (mut state.time)}}
        />
      </template>,
    );
    assert.dom("input").hasValue("00:10");

    await triggerKeyEvent("input", "keydown", "ArrowDown");
    assert.dom("input").hasValue("00:00");

    await triggerKeyEvent("input", "keydown", "ArrowUp", { ctrlKey: true });
    assert.dom("input").hasValue("01:00");

    await triggerEvent("input", "wheel", { deltaY: 10 });
    assert.dom("input").hasValue("00:50");

    await triggerEvent("input", "wheel", { deltaY: -10 });
    assert.dom("input").hasValue("01:00");
  });

  test("it supports empty time", async function (assert) {
    class State {
      @tracked time = null as DateTime | null;
    }

    const state = new State();

    await render(
      <template>
        <Timepicker @value={{state.time}} @onChange={{fn (mut state.time)}} />
      </template>,
    );
    assert.dom("input").hasNoValue();

    await triggerKeyEvent("input", "keydown", "ArrowDown");
    assert.dom("input").hasValue("00:00"); // the minimum

    await fillIn("input", "");
    assert.dom("input").hasNoValue();
    assert.deepEqual(state.time, null);

    await triggerKeyEvent("input", "keydown", "ArrowUp", { ctrlKey: true }); // ctrl key -> big step
    assert.dom("input").hasValue("00:15");

    await fillIn("input", "");
    assert.dom("input").hasNoValue();
    assert.deepEqual(state.time, null);

    await fillIn("input", "130");
    assert.dom("input").hasValue("01:30");
    assert.equal(state.time?.hour, 1);
    assert.equal(state.time?.minute, 30);
  });

  test("it supports @min", async function (assert) {
    const min = DateTime.fromObject({ hour: 5, minute: 10 });

    class State {
      @tracked time = DateTime.fromObject({
        hour: 6,
        minute: 10,
      }) as DateTime | null;
    }

    const state = new State();

    await render(
      <template>
        <Timepicker
          @min={{min}}
          @value={{state.time}}
          @onChange={{fn (mut state.time)}}
        />
      </template>,
    );

    assert.dom("input").hasValue("06:10");
    await fillIn("input", "00:00");
    assert.dom("input").hasValue("05:10");
  });

  test("it supports @max", async function (assert) {
    const max = DateTime.fromObject({ hour: 12, minute: 10 });

    class State {
      @tracked time = DateTime.fromObject({
        hour: 6,
        minute: 10,
      }) as DateTime | null;
    }

    const state = new State();

    await render(
      <template>
        <Timepicker
          @max={{max}}
          @value={{state.time}}
          @onChange={{fn (mut state.time)}}
        />
      </template>,
    );

    assert.dom("input").hasValue("06:10");

    await fillIn("input", "00:00");
    assert.dom("input").hasValue("00:00");

    await fillIn("input", "13:00");
    assert.dom("input").hasValue("12:10");
  });
});
