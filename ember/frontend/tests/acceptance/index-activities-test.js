import { click, currentURL, findAll, visit } from "@ember/test-helpers";
import { authenticateSession } from "ember-simple-auth/test-support";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { setupApplicationTest } from "timed/tests/helpers";

module("Acceptance | index activities", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");

    await authenticateSession({ user_id: user.id });

    this.activities = this.server.createList("activity", 5, {
      userId: user.id,
    });

    this.user = user;
  });

  test("can visit /", async function (assert) {
    await visit("/");

    assert.strictEqual(currentURL(), "/");
  });

  test("can list activities", async function (assert) {
    await visit("/");

    assert.dom("[data-test-activity-row]").exists({ count: 5 });
  });

  test("can start an activity", async function (assert) {
    await visit("/");

    await click('[data-test-activity-row-id="1"] [data-test-start-activity]');

    assert.dom('[data-test-activity-row-id="6"]').hasClass("active");
  });

  test("can start an activity of a past day", async function (assert) {
    const lastDay = DateTime.now().minus({ days: 1 });

    const activity = this.server.create("activity", {
      date: lastDay,
      userId: this.user.id,
      comment: "Test",
    });

    await visit(`/?day=${lastDay.toISODate()}`);

    await click(
      `[data-test-activity-row-id="${activity.id}"] [data-test-start-activity]`,
    );

    assert.strictEqual(currentURL(), "/");

    assert
      .dom(findAll('[data-test-activity-row-id="7"] td')[2])
      .hasText(activity.comment);
  });

  test("can stop an activity", async function (assert) {
    await visit("/");

    await click('[data-test-activity-row-id="1"] [data-test-start-activity]');

    assert.dom('[data-test-activity-row-id="6"]').hasClass("active");

    await click('[data-test-activity-row-id="6"] [data-test-stop-activity]');

    assert.dom('[data-test-activity-row-id="6"]').doesNotHaveClass("active");
  });
  test("shows a warning when generating reports from unknown tasks", async function (assert) {
    this.server.create("activity", "unknown", { userId: this.user.id });

    await visit("/");

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-unknown-warning] button.btn-default");

    assert.strictEqual(currentURL(), "/");

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-unknown-warning] button.btn-primary");

    assert.strictEqual(currentURL(), "/reports");
  });

  test("shows a warning when generating reports from day overlapping activities", async function (assert) {
    const date = DateTime.now().minus({ days: 1 });

    this.server.create("activity", "active", { userId: this.user.id, date });

    await visit(`/?day=${date.toISODate()}`);

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-overlapping-warning] button.btn-default");

    assert.notOk(currentURL().includes("reports"));

    await click("[data-test-activity-generate-timesheet]");
    await click("[data-test-overlapping-warning] button.btn-primary");

    assert.ok(currentURL().includes("reports"));
  });

  test("can handle both warnings", async function (assert) {
    const date = DateTime.now().minus({ days: 1 });

    this.server.create("activity", "unknown", { userId: this.user.id, date });
    this.server.create("activity", "active", { userId: this.user.id, date });

    await visit(`/?day=${date.toISODate()}`);

    // both close if one clicks cancel
    await click("[data-test-activity-generate-timesheet]");
    assert.dom("[data-test-modal-visible]").exists({ count: 2 });
    await click("[data-test-overlapping-warning] button.btn-default");
    assert.dom("[data-test-modal-visible]").exists({ count: 0 });
    assert.notOk(currentURL().includes("reports"));

    // both must be fine if test should continue
    await click("[data-test-activity-generate-timesheet]");
    assert.dom("[data-test-modal-visible]").exists({ count: 2 });
    await click("[data-test-overlapping-warning] button.btn-primary");
    assert.dom("[data-test-modal-visible]").exists({ count: 1 });
    await click("[data-test-unknown-warning] button.btn-default");
    assert.dom("[data-test-modal-visible]").exists({ count: 0 });

    await click("[data-test-activity-generate-timesheet]");
    assert.dom("[data-test-modal-visible]").exists({ count: 2 });
    await click("[data-test-unknown-warning] button.btn-primary");
    assert.dom("[data-test-modal-visible]").exists({ count: 1 });
    await click("[data-test-overlapping-warning] button.btn-default");
    assert.dom("[data-test-modal-visible]").exists({ count: 0 });
    assert.notOk(currentURL().includes("reports"));

    // if both are fine continue
    await click("[data-test-activity-generate-timesheet]");
    assert.dom("[data-test-modal-visible]").exists({ count: 2 });
    await click("[data-test-overlapping-warning] button.btn-primary");
    assert.dom("[data-test-modal-visible]").exists({ count: 1 });
    await click("[data-test-unknown-warning] button.btn-primary");
    assert.dom("[data-test-modal-visible]").exists({ count: 0 });
    assert.ok(currentURL().includes("reports"));
  });

  test("navigates to timesheet after generating reports", async function (assert) {
    await visit("/");

    await click("[data-test-activity-generate-timesheet]");

    assert.strictEqual(currentURL(), "/reports");
  });
});
