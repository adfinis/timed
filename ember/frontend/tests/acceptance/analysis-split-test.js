import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
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
      `reports/${this.report.id}/split`,
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

    await fillIn("[data-test-second-report-comment]", "foobar");

    await fillIn("[data-test-review-comment]", "test comment 123");

    await click(".btn-primary");

    const {
      data: { attributes },
    } = res;

    assert.deepEqual(Object.keys(attributes), [
      "updated_original_report",
      "second_report",
      "comment",
    ]);

    assert.strictEqual(currentURL(), "/analysis?ordering=-date%2Cid");
  });

  test("it shows split button when selecting one report", async function (assert) {
    // TODO: try to figure out why it says "the data on this pag is taking up
    // too much space for your current device", it thinks it's opened on a phone
    visit("/analysis");

    await selectChoose(
      "[data-test-filter-customer]",
      ".ember-power-select-option",
      0,
    );

    await click("tbody > tr:nth-child(1)");

    assert.dom("[data-test-split-button]").exists();
  });

  test("it doesn't show split button when selecting none or multiple reports", async function (assert) {
    // TODO: fix same problem as in the test above
    visit("/analysis");

    await selectChoose(
      "[data-test-filter-customer]",
      ".ember-power-select-option",
      0,
    );

    assert.dom("[data-test-split-button]").doesNotExists();

    await click("tbody > tr:nth-child(1)");
    await click("tbody > tr:nth-child(2)");

    assert.dom("[data-test-split-button]").doesNotExists();
  });
});
