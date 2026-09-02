import { click, fillIn, render } from "@ember/test-helpers";
import { selectChoose } from "ember-power-select/test-support";
import { setupRenderingTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

// when can we split / when can't we split
// when i update the duration of one of the two reports, does the other input get updated as well? (they should always have the same sum)
// does the form validation work? e.g. what happens if I try to input 1000:00 in one of the inputs, or more than the original report (duration wsie)
// does it send an API request, with the correct data

import SplitReport from "timed/components/split-report";
import { setupMirage } from "timed/tests/helpers/mirage";

module("Integration | Component | split report", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { isSuperuser: true });
    this.user = user;
    await authenticateSession({ user_id: user.id });

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

  test("can not split without task on second report", async function (assert) {
    await fillIn("[data-test-second-report-comment]", "foobar");

    await fillIn("[data-test-review-comment]", "test comment 123");

    await fillIn("[data-test-second-report-durationpicker]", "01:00");

    await click(".btn-primary");

    // TODO: check what to assert here, button isn't disabled or something
    // like that, maybe check for validation error notification
  });

  test("can not split without a review comment", async function (assert) {
    this.server.create("task");
    await render(<template><SplitReport @report={{this.report}} /></template>);

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
    await fillIn("[data-test-second-report-comment]", "foobar");

    await fillIn("[data-test-second-report-durationpicker]", "01:00");

    await click(".btn-primary");

    // TODO: check what to assert here, button isn't disabled or something
    // like that, maybe check for validation error notification
  });

  test("changes the duration automatically when updating one of them", async function (assert) {
    await render(<template><SplitReport @report={{this.report}} /></template>);

    await fillIn("[data-test-second-report-durationpicker]", "01:00");

    await fillIn("[data-test-review-comment]", "test comment 123");

    assert.dom("[data-test-original-report-durationpicker]").hasValue("02:00");
    assert.dom("[data-test-second-report-durationpicker]").hasValue("01:00");

    await fillIn("[data-test-second-report-durationpicker]", "02:45");

    assert.dom("[data-test-original-report-durationpicker]").hasValue("00:15");
    assert.dom("[data-test-second-report-durationpicker]").hasValue("02:45");
  });

  test("changes invalid duration to valid duration", async function (assert) {
    await render(<template><SplitReport @report={{this.report}} /></template>);

    await fillIn("[data-test-second-report-durationpicker]", "1000:00");

    assert.dom("[data-test-original-report-durationpicker]").hasValue("00:15");
    assert.dom("[data-test-second-report-durationpicker]").hasValue("02:45");

    await fillIn("[data-test-second-report-durationpicker]", "-1000:00");

    assert.dom("[data-test-original-report-durationpicker]").hasValue("02:45");
    assert.dom("[data-test-second-report-durationpicker]").hasValue("00:15");

    await fillIn("[data-test-original-report-durationpicker]", "1000:00");

    assert.dom("[data-test-original-report-durationpicker]").hasValue("02:45");
    assert.dom("[data-test-second-report-durationpicker]").hasValue("00:15");

    await fillIn("[data-test-original-report-durationpicker]", "-1000:00");

    assert.dom("[data-test-original-report-durationpicker]").hasValue("00:15");
    assert.dom("[data-test-second-report-durationpicker]").hasValue("02:45");
  });
});
