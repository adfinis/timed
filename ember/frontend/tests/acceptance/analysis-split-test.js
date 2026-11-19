import {
  click,
  fillIn,
  currentURL,
  visit,
  pauseTest,
} from "@ember/test-helpers";
import { selectChoose } from "ember-power-select/test-support";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

import { setupApplicationTest } from "timed/tests/helpers";

// when can we split / when can't we split

module("Acceptance | analysis split report", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { isSuperuser: true });
    this.user = user;
    await authenticateSession({ user_id: user.id });
    this.server.createList("report", 5);

    // create a report with mirage and load it via the Ember Data store to get
    // an ember object and load it with the task
    const mirageReport = this.server.create("report", {
      duration: "03:00:00",
    });
    const store = this.owner.lookup("service:store");
    this.report = await store.findRecord("report", mirageReport.id, {
      include: "task,task.project,task.project.customer",
    });
  });

  test("can split", async function (assert) {
    await visit(`/analysis/split/${this.report.id}`);

    let res = {};

    this.server.post(
      `reports/split/${this.report.id}`,
      (_, { requestBody }) => {
        res = JSON.parse(requestBody);
      },
    );

    await selectChoose(
      "[data-test-second-report-customer]",
      ".ember-power-select-option",
      1,
    );

    await selectChoose(
      "[data-test-second-report-project]",
      ".ember-power-select-option",
      0,
    );

    await selectChoose(
      "[data-test-second-report-task]",
      ".ember-power-select-option",
      0,
    );

    await fillIn("[data-test-second-report-durationpicker]", "01:00");

    await fillIn("[data-test-review-comment]", "test comment 123");

    await pauseTest();

    await click(".btn-primary");

    debugger;

    const {
      data: { attributes },
    } = res;

    assert.deepEqual(Object.keys(attributes), [
      "comment",
      "not-billable",
      "review",
      "duration",
    ]);

    assert.strictEqual(currentURL(), "/analysis");
  });
});
