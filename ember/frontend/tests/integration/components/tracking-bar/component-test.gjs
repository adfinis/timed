import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import { setup as setupTrackingService } from "timed/tests/helpers/tracking-mock";
import TrackingBar from "timed/components/tracking-bar";

module("Integration | Component | tracking bar", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    setupTrackingService(this, {
      activity: { comment: "asdf" },
      fetchRecentTasks: { last: Promise.resolve() },
      fetchCustomers: {
        perform: () => {},
        last: Promise.resolve(),
      },
    });
  });

  test("renders", async function (assert) {
    await render(<template><TrackingBar /></template>);

    assert.dom("textarea[type=text]").hasValue("asdf");
  });
});
