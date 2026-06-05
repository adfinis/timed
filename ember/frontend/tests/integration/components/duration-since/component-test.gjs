import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { DateTime, Duration } from "luxon";
import { module, test } from "qunit";
import DurationSince from "timed/components/duration-since";

module("Integration | Component | duration since", function (hooks) {
  setupRenderingTest(hooks);

  test("computes the duration correctly", async function (assert) {
    this.set(
      "start",
      DateTime.now().set({ millisecond: 0 }).minus({
        minutes: 5,
        seconds: 5,
      }),
    );

    await render(<template><DurationSince @from={{this.start}} /></template>);

    assert.ok(this.element);
    assert.dom(this.element).hasText("00:05:05");
  });

  test("computes the duration correctly with elapsed time", async function (assert) {
    this.set(
      "start",
      DateTime.now().minus({
        minutes: 5,
        seconds: 5,
      }),
    );

    this.set(
      "elapsed",
      Duration.fromObject({
        hours: 1,
        minutes: 1,
        seconds: 1,
      }),
    );

    await render(
      <template>
        <DurationSince @from={{this.start}} @elapsed={{this.elapsed}} />
      </template>,
    );

    assert.ok(this.element);
    assert.dom(this.element).hasText("01:06:06");
  });
});
