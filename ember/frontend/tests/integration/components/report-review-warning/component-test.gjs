import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ReportReviewWarning from "timed/components/report-review-warning";

module("Integration | Component | report review warning", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(<template><ReportReviewWarning /></template>);
    assert.ok(this.element);
  });
});
