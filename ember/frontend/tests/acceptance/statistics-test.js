import { click, fillIn, currentURL, visit, find } from "@ember/test-helpers";
import { authenticateSession } from "ember-simple-auth/test-support";
import { DateTime } from "luxon";
import { module, test, skip } from "qunit";
import { dateToString } from "ui-core/utils/date";

import { setupApplicationTest } from "timed/tests/helpers";

module("Acceptance | statistics", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");

    await authenticateSession({ user_id: user.id });

    this.server.createList("year-statistic", 5);
    this.server.createList("month-statistic", 5);
    this.server.createList("customer-statistic", 5);
    this.server.createList("project-statistic", 5);
    this.server.createList("task-statistic", 5);
    this.server.createList("user-statistic", 5);
  });

  test("can view statistics by year", async function (assert) {
    await visit("/statistics");

    assert.dom("thead > tr > th").exists({ count: 3 });
    assert.dom("tbody > tr").exists({ count: 5 });
    assert.dom("tfoot").includesText("Total");
  });

  test("can view statistics by month", async function (assert) {
    await visit("/statistics?type=month");

    assert.dom("thead > tr > th").exists({ count: 4 });
    assert.dom("tbody > tr").exists({ count: 5 });
    assert.dom("tfoot").includesText("Total");
  });

  test("can view statistics by customer", async function (assert) {
    await visit("/statistics?type=customer&fromDate=1900-01-01");

    assert.dom("thead > tr > th").exists({ count: 3 });
    assert.dom("tbody > tr").exists({ count: 5 });
    assert.dom("tfoot").includesText("Total");
  });

  test("can view statistics by project", async function (assert) {
    await visit("/statistics?type=project&customer=1");

    assert.dom("thead > tr > th").exists({ count: 6 });
    assert.dom("tbody > tr").exists({ count: 5 });
    assert.dom("tfoot").includesText("Total");
  });

  skip("can view statistics by task", async function (assert) {
    await visit("/statistics?type=task&customer=1&project=1");

    assert.dom("thead > tr > th").exists({ count: 6 });
    assert.dom("tbody > tr").exists({ count: 5 });
    assert.dom("tfoot").includesText("Total");
  });

  test("can view statistics by user", async function (assert) {
    await visit("/statistics?type=user");

    assert.dom("thead > tr > th").exists({ count: 3 });
    assert.dom("tbody > tr").exists({ count: 5 });
    assert.dom("tfoot").includesText("Total");
  });

  test("can filter and reset filter", async function (assert) {
    await visit("/statistics");

    const from = DateTime.now();
    const to = DateTime.now().minus({ days: 10 });

    await fillIn("[data-test-filter-from-date] input", dateToString(from));
    await fillIn("[data-test-filter-to-date] input", dateToString(to));

    assert.ok(currentURL().includes(`fromDate=${from.toISODate()}`));
    assert.ok(currentURL().includes(`toDate=${to.toISODate()}`));

    await click(".filter-sidebar-reset");

    assert.notOk(currentURL().includes(`fromDate=${from}`));
    assert.notOk(currentURL().includes(`toDate=${to}`));
  });

  test("shows missing parameters message", async function (assert) {
    await visit("/statistics?type=task");

    assert
      .dom(".empty[data-test-missing-filter-params]")
      .includesText("Customer and project are required parameters");
  });

  test("resets ordering on type change", async function (assert) {
    await visit("/statistics?type=month&ordering=year");

    await click(".nav-tabs li a:first-child");

    assert.notOk(
      currentURL().includes("Customer and project are required parameters"),
    );
  });

  test("can have initial filters", async function (assert) {
    await this.server.createList("billing-type", 3);

    const params = {
      customer: 1,
      project: 1,
      task: 1,
      user: 1,
      reviewer: 1,
      billingType: 1,
      fromDate: DateTime.now().minus({ days: 10 }).toISODate(),
      toDate: DateTime.now().toISODate(),
      review: 1,
      notBillable: 0,
      verified: 0,
    };

    await visit(
      `/statistics?${Object.keys(params)
        .map((k) => `${k}=${params[k]}`)
        .join("&")}`,
    );

    assert
      .dom("[data-test-filter-customer] .ember-power-select-selected-item")
      .exists();

    assert
      .dom("[data-test-filter-project] .ember-power-select-selected-item")
      .exists();

    assert
      .dom("[data-test-filter-task] .ember-power-select-selected-item")
      .exists();

    assert
      .dom("[data-test-filter-user] .ember-power-select-selected-item")
      .exists();

    assert
      .dom("[data-test-filter-reviewer] .ember-power-select-selected-item")
      .exists();

    assert.strictEqual(
      find("[data-test-filter-billing-type] select").options.selectedIndex,
      1,
    );

    assert.dom("[data-test-filter-from-date] input").exists();

    assert.dom("[data-test-filter-to-date] input").exists();

    assert.dom("[data-test-filter-review] .btn.active").exists();
    assert.dom("[data-test-filter-not-billable] .btn.active").exists();
    assert.dom("[data-test-filter-verified] .btn.active").exists();
  });
});
