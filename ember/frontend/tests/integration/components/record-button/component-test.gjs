import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import RecordButton from "timed/components/record-button";

module("Integration | Component | record button", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><RecordButton /></template>);
    assert.dom("[data-test-record-start]").exists();
    assert.dom("[data-test-record-stop]").doesNotExist();
  });

  test("can stop", async function (assert) {
    this.set("recording", true);
    this.set("activity", { id: 1 });

    this.set("stopAction", () => {
      this.set("recording", false);

      assert.step("stop");
      assert.dom("[data-test-record-stop]").doesNotExist();
    });

    await render(
      <template>
        <RecordButton
          @recording={{this.recording}}
          @activity={{this.activity}}
          @onStop={{this.stopAction}}
        />
      </template>,
    );

    await click("[data-test-record-stop]");

    assert.verifySteps(["stop"]);
  });

  test("can start", async function (assert) {
    this.set("recording", false);
    this.set("activity", { id: 1 });

    this.set("startAction", () => {
      this.set("recording", true);

      assert.step("start");
      assert.dom("[data-test-record-stop]").exists({ count: 1 });
    });

    await render(
      <template>
        <RecordButton
          @recording={{this.recording}}
          @activity={{this.activity}}
          @onStart={{this.startAction}}
        />
      </template>,
    );

    await click("[data-test-record-start]");

    assert.verifySteps(["start"]);
  });
});
