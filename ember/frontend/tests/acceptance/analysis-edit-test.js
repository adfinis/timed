import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { selectChoose } from "ember-power-select/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | analysis edit", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { isSuperuser: true });
    this.user = user;

    await authenticateSession({ user_id: user.id });

    this.reportIntersection = this.server.create("report-intersection", {
      verified: false,
      review: true,
    });
  });

  test("can visit /analysis/edit", async function (assert) {
    await visit("/analysis/edit");

    assert.strictEqual(currentURL(), "/analysis/edit");
  });

  test("can edit", async function (assert) {
    const customer = this.server.create("customer");
    this.server.create("report-intersection", { customer });

    await visit("/analysis/edit?id=1,2,3");

    let res = {};

    this.server.post("/reports/bulk", (_, { requestBody }) => {
      res = JSON.parse(requestBody);
    });

    await fillIn("[data-test-report-comment]", "test comment 123");
    await click("[data-test-not-billable] input");
    await click("[data-test-review] input");

    await click(".btn-primary");

    const {
      data: { type, attributes, relationships },
    } = res;

    assert.strictEqual(type, "report-bulks");

    // only changed attributes were sent
    assert.deepEqual(Object.keys(attributes), [
      "comment",
      "not-billable",
      "review",
    ]);

    assert.deepEqual(Object.keys(relationships), []);

    assert.strictEqual(currentURL(), "/analysis?ordering=-date%2Cid");
  });

  test("can cancel", async function (assert) {
    await visit("/analysis/edit");

    await click("[data-test-cancel]");

    assert.strictEqual(currentURL(), "/analysis?ordering=-date%2Cid");
  });

  test("can reset", async function (assert) {
    await visit("/analysis/edit");

    const initialValue = this.element.querySelector(
      "[data-test-report-comment]",
    ).value;

    await fillIn("[data-test-report-comment] ", "test");

    assert.dom("[data-test-report-comment]").hasValue("test");

    await click("[data-test-reset]");

    assert.dom("[data-test-report-comment]").hasValue(initialValue);
  });

  test("can not verify", async function (assert) {
    await visit("/analysis/edit");

    assert.dom("[data-test-verified] input").isDisabled();
  });

  test("cannot verify unreviewed reports", async function (assert) {
    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isDisabled();
    assert
      .dom("[data-test-verified] label")
      .hasAttribute(
        "title",
        "Please review selected reports before verifying.",
      );
  });

  test("can verify reviewed reports", async function (assert) {
    this.reportIntersection.update({ review: false });
    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isNotDisabled();
    assert.dom("[data-test-verified] label").hasAttribute("title", "");
  });

  test("cannot verify report if no reviewer or superuser", async function (assert) {
    this.reportIntersection.update({ review: false });
    const user = this.server.create("user");

    this.server.get("users/me", function () {
      return user;
    });

    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isDisabled();
    assert
      .dom("[data-test-verified] label")
      .hasAttribute(
        "title",
        "Please select yourself as 'reviewer' to verify reports.",
      );
  });

  test("cannot verify report if user is not reviewer or superuser and report needs review", async function (assert) {
    this.reportIntersection.update({ review: true });
    const user = this.server.create("user");

    this.server.get("users/me", function () {
      return user;
    });

    await visit("/analysis/edit?id=1,2,3");

    assert.dom("[data-test-verified] input").isDisabled();
    assert
      .dom("[data-test-verified] label")
      .hasAttribute(
        "title",
        "Please select yourself as 'reviewer' to verify reports. Please review selected reports before verifying.",
      );
  });
  test("cannot verify report and move it at the same time", async function (assert) {
    // we set the name of the task to something that faker will not produce
    // otherwise this is flaky as tasks with the same name could exist (and we select them in the dropdown by name)
    const task = this.server.create("task", { name: "the task" });
    const otherTasks = this.server.createList("task", 10);

    // giving `project`/`projectId` as an argument to `createList` does not work
    // this is a workaround
    otherTasks.forEach((t) => {
      t.update({ project: task.project });
    });

    this.reportIntersection.update({
      review: false,
      customer: task.project.customer,
      project: task.project,
      taskId: task.id,
    });
    await visit(`/analysis/edit?id=${task.id}`);

    // verified checkbox is not disabled
    assert.dom("[data-test-verified] input").isNotDisabled();
    assert.dom("[data-test-verified] label").hasAttribute("title", "");

    // select another task
    await selectChoose("[data-test-task]", otherTasks.at(-1).name);

    // set verified to `true`
    await click("[data-test-verified] input");

    // the error message is visible
    assert
      .dom("[data-test-verified] + .invalid-feedback")
      .hasText("Cannot verify and move report(s) at the same time.");

    // set verified back to`false`
    await click("[data-test-verified] input");
    // the error message no longer exists (as there is no error)
    assert.dom("[data-test-verified] + .invalid-feedback").doesNotExist();

    // set verified back to `true`
    await click("[data-test-verified] input");

    // the error message is visible again
    assert
      .dom("[data-test-verified] + .invalid-feedback")
      .hasText("Cannot verify and move report(s) at the same time.");

    // select the original task
    await selectChoose("[data-test-task]", task.name);

    // the error message is gone
    assert.dom("[data-test-verified] + .invalid-feedback").doesNotExist();
  });

  test("review comment validation", async function (assert) {
    const task = this.server.create("task");
    const otherTask = this.server.create("task");

    // giving this as an argument to `.create` directly doesn't work
    // this is a workaround
    otherTask.project.update({ customer: task.project.customer });

    const taskOtherCustomer = this.server.create("task");

    // sanity check
    assert.deepEqual(task.project.customer.id, otherTask.project.customer.id);
    assert.notDeepEqual(
      task.project.customer.id,
      taskOtherCustomer.project.customer.id,
    );

    this.reportIntersection.update({
      review: false,
      customer: task.project.customer,
      project: task.project,
      taskId: task.id,
    });

    await visit(`/analysis/edit?id=${task.id}`);

    // there is no validation error
    assert.dom("[data-test-review-comment] + .invalid-feedback").doesNotExist();

    // select another task (same customer, different project)
    await selectChoose("[data-test-project]", otherTask.project.name);
    await selectChoose("[data-test-task]", otherTask.name);

    // there is no validation error
    assert.dom("[data-test-review-comment] + .invalid-feedback").doesNotExist();

    // select another customer
    await selectChoose(
      "[data-test-customer]",
      taskOtherCustomer.project.customer.name,
    );

    // there now is a validation error
    assert
      .dom("[data-test-review-comment-label] + .invalid-feedback")
      .hasText(
        "Review Comment is required when moving report(s) to a different customer.",
      );

    // select a project on the other customer
    await selectChoose("[data-test-project]", taskOtherCustomer.project.name);

    // the validation error is still here
    assert
      .dom("[data-test-review-comment-label] + .invalid-feedback")
      .hasText(
        "Review Comment is required when moving report(s) to a different customer.",
      );

    // select a task on the other customer
    await selectChoose("[data-test-task]", taskOtherCustomer.name);

    // the validation error is still here
    assert
      .dom("[data-test-review-comment-label] + .invalid-feedback")
      .hasText(
        "Review Comment is required when moving report(s) to a different customer.",
      );

    await fillIn("[data-test-review-comment]", "foo bar baz.");

    // no more error
    assert
      .dom("[data-test-review-comment-label] + .invalid-feedback")
      .doesNotExist();
  });
});
