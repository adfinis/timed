import { module, test } from "qunit";
import { setupRenderingTest } from "../helpers";
import {
  fillIn,
  render,
  triggerEvent,
  triggerKeyEvent,
} from "@ember/test-helpers";
import Durationpicker, {
  ActivityDurationpicker,
  ReportDurationpicker,
} from "#src/components/durationpicker.gts";
import { Duration } from "luxon";
import { fn } from "@ember/helper";
import { tracked } from "@glimmer/tracking";

module("Integration | Component | durationpicker", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    const min = Duration.fromMillis(0);
    const max = Duration.fromObject({ days: 10 });

    class State {
      @tracked duration = Duration.fromObject({ hours: 2, minutes: 20 });
    }

    const state = new State();

    await render(
      <template>
        <Durationpicker
          @min={{min}}
          @max={{max}}
          @value={{state.duration}}
          @onChange={{fn (mut state.duration)}}
        />
      </template>,
    );

    assert.dom("input").hasValue("02:20");
  });

  test("it renders", async function (assert) {
    const min = Duration.fromMillis(0);
    const max = Duration.fromObject({ days: 10 });

    class State {
      @tracked duration = Duration.fromObject({ hours: 2, minutes: 20 });
    }

    const state = new State();

    await render(
      <template>
        <Durationpicker
          @min={{min}}
          @max={{max}}
          @value={{state.duration}}
          @onChange={{fn (mut state.duration)}}
        />
      </template>,
    );

    assert.dom("input").hasValue("02:20");
  });

  test("it handles events", async function (assert) {
    const min = Duration.fromMillis(0);
    const max = Duration.fromObject({ days: 10 });
    const step = Duration.fromObject({ minutes: 10 });

    class State {
      @tracked duration = Duration.fromObject({ hours: 0, minutes: 10 });
    }

    const state = new State();

    await render(
      <template>
        <Durationpicker
          @min={{min}}
          @max={{max}}
          @value={{state.duration}}
          @step={{step}}
          @onChange={{fn (mut state.duration)}}
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

  test("report durationpicker", async function (assert) {
    class State {
      @tracked duration = Duration.fromObject({ minutes: 15 });
    }

    const state = new State();

    await render(
      <template>
        <ReportDurationpicker
          @value={{state.duration}}
          @onChange={{fn (mut state.duration)}}
        />
      </template>,
    );
    assert.dom("input").hasValue("00:15");

    await fillIn("input", "130");
    assert.dom("input").hasValue("01:30");

    await fillIn("input", "90");
    assert.dom("input").hasValue("01:30");

    await fillIn("input", "15");
    assert.dom("input").hasValue("00:15");
  });

  test("activity durationpicker", async function (assert) {
    class State {
      @tracked duration = Duration.fromObject({ minutes: 5 });
    }

    const state = new State();

    await render(
      <template>
        <ActivityDurationpicker
          @value={{state.duration}}
          @onChange={{fn (mut state.duration)}}
        />
      </template>,
    );
    assert.dom("input").hasValue("00:05");

    await fillIn("input", "10");
    assert.dom("input").hasValue("00:10");

    await fillIn("input", "120");
    assert.dom("input").hasValue("01:20");
  });
});
