import { fn } from "@ember/helper";
import { render, fillIn } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ReportComment from "timed/components/report-comment";
import { setupMirage } from "timed/tests/helpers/mirage";

module("Integration | Component | ReportComment", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("basic functionality works", async function (assert) {
    class State {
      @tracked comment = "";
    }

    const state = new State();

    await render(
      <template>
        <ReportComment
          data-test-report-comment
          @value={{state.comment}}
          @onChange={{fn (mut state.comment)}}
        />
      </template>,
    );

    assert.dom("[data-test-report-comment]").exists();
    assert.dom("[data-test-report-comment]").hasNoValue();

    await fillIn("[data-test-report-comment]", "foo");
    assert.strictEqual(state.comment, "foo");
  });
});
