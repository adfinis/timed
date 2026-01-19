import { module, test } from "qunit";
import { setupRenderingTest } from "../helpers";
import { render } from "@ember/test-helpers";
import Durationpicker from "#src/components/durationpicker.gts";
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
});
