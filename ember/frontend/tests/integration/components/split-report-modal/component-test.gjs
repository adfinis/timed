import Service from "@ember/service";
import { click, fillIn, render, triggerEvent } from "@ember/test-helpers";
import { selectChoose } from "ember-power-select/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ModalTarget from "timed/components/modal-target";
import SplitReportModal from "timed/components/split-report-modal";
import { setupMirage } from "timed/tests/helpers/mirage";

const NEW_REPORT_COL = ".modal-body .grid > div:last-child";

module("Integration | Component | split report modal", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.report = this.server.create("report", {
      comment: "Original comment",
      duration: "01:00:00",
    });
    this.reportId = [String(this.report.id)];

    this.server.get("/reports/:id", function (schema, request) {
      const report = schema.reports.find(request.params.id);
      const serialized = this.serialize(report);
      const task = schema.tasks.find(report.taskId);
      if (task) {
        serialized.included = [this.serialize(task).data];
      }
      return serialized;
    });

    this.server.post("/reports/:id/split", () => ({ data: {} }));
  });

  async function openModal() {
    await click("[data-test-split-report]");
  }

  async function selectNewTask() {
    await selectChoose(
      `${NEW_REPORT_COL} .customer-select`,
      ".ember-power-select-option",
      1,
    );
    await selectChoose(
      `${NEW_REPORT_COL} .project-select`,
      ".ember-power-select-option",
      0,
    );
    await selectChoose(
      `${NEW_REPORT_COL} .task-select`,
      ".ember-power-select-option",
      0,
    );
  }

  async function setNewDuration(value) {
    const input = document.querySelector(
      "input[title='Duration for new report']",
    );
    await fillIn(input, value);
    await triggerEvent(input, "change");
  }

  test("renders the split report button", async function (assert) {
    await render(
      <template><SplitReportModal @report-id={{this.reportId}} /></template>,
    );

    assert.dom("[data-test-split-report]").hasText("Split Report");
  });

  test("button is enabled by default", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    assert.dom("[data-test-split-report]").isNotDisabled();
  });

  test("button is disabled when @disabled is true", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} @disabled={{true}} />
      </template>,
    );

    assert.dom("[data-test-split-report]").isDisabled();
  });

  test("button shows tooltip when @disabled is true", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} @disabled={{true}} />
      </template>,
    );

    assert
      .dom("[data-test-split-report]")
      .hasAttribute(
        "title",
        "Only if there is one report selected, and the report is not verified",
      );
  });

  test("button has no tooltip when enabled", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    assert.dom("[data-test-split-report]").doesNotHaveAttribute("title");
  });

  test("modal is not visible initially", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    assert.dom(".modal-header").doesNotExist();
  });

  test("opens modal on button click", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();

    assert.dom(".modal-header h3").hasText("Split Report");
  });

  test("modal shows two-column layout with original and new report sections", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();

    assert.dom(".modal-body").includesText("Original report");
    assert.dom(".modal-body").includesText("Second Report");
  });

  test("populates original report comment after opening", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();

    assert
      .dom("[aria-label='Comment for original report']")
      .hasValue("Original comment");
  });

  test("new comment input is empty initially", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();

    assert.dom("[aria-label='Comment for new report']").hasValue("");
  });

  test("split button is disabled when no new task is selected", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();

    assert.dom("[data-test-split-report-confirm]").isDisabled();
  });

  test("cancel button closes the modal", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    assert.dom(".modal-header").exists();

    await click("[data-test-split-report-cancel]");

    assert.dom(".modal-header").doesNotExist();
  });

  test("close icon in modal header closes the modal", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    assert.dom(".modal-header").exists();

    await click(".modal-header button");

    assert.dom(".modal-header").doesNotExist();
  });

  test("updating new comment input changes value", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await fillIn("[aria-label='Comment for new report']", "New comment");

    assert.dom("[aria-label='Comment for new report']").hasValue("New comment");
  });

  test("updating original comment input changes value", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await fillIn(
      "[aria-label='Comment for original report']",
      "Updated comment",
    );

    assert
      .dom("[aria-label='Comment for original report']")
      .hasValue("Updated comment");
  });

  test("comment is reset between openings", async function (assert) {
    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await fillIn("[aria-label='Comment for new report']", "temp comment");
    await click("[data-test-split-report-cancel]");

    await openModal();

    assert.dom("[aria-label='Comment for new report']").hasValue("");
  });

  test("calls split endpoint with old and new report data", async function (assert) {
    assert.expect(3);

    let capturedBody;
    this.server.post("/reports/:id/split", (_, { requestBody, params }) => {
      capturedBody = JSON.parse(requestBody);
      assert.strictEqual(params.id, String(this.report.id));
      return { data: {} };
    });

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await selectNewTask();
    await setNewDuration("0:30");
    await click("[data-test-split-report-confirm]");

    assert.ok(
      capturedBody.data.attributes.updated_original_report,
      "updated_original_report is present in payload",
    );
    assert.ok(
      capturedBody.data.attributes.second_report,
      "second_report is present in payload",
    );
  });

  test("sends modified old report data to the split endpoint", async function (assert) {
    assert.expect(2);

    let capturedBody;
    this.server.post("/reports/:id/split", (_, { requestBody }) => {
      capturedBody = JSON.parse(requestBody);
      return { data: {} };
    });

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await fillIn(
      "[aria-label='Comment for original report']",
      "Updated old comment",
    );
    await selectNewTask();
    await setNewDuration("0:30");
    await click("[data-test-split-report-confirm]");

    assert.strictEqual(
      capturedBody.data.attributes.updated_original_report.comment,
      "Updated old comment",
      "sends updated old comment",
    );
    assert.strictEqual(
      capturedBody.data.attributes.updated_original_report.duration,
      "00:30:00",
      "old report duration is the remaining time after split",
    );
  });

  test("sends new report data to the split endpoint", async function (assert) {
    assert.expect(2);

    let capturedBody;
    this.server.post("/reports/:id/split", (_, { requestBody }) => {
      capturedBody = JSON.parse(requestBody);
      return { data: {} };
    });

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await selectNewTask();
    await fillIn("[aria-label='Comment for new report']", "New report comment");
    await setNewDuration("0:30");
    await click("[data-test-split-report-confirm]");

    assert.strictEqual(
      capturedBody.data.attributes.second_report.comment,
      "New report comment",
      "sends new report comment",
    );
    assert.strictEqual(
      capturedBody.data.attributes.second_report.duration,
      "00:30:00",
      "sends new report duration",
    );
  });

  test("closes modal and calls afterSave on successful split", async function (assert) {
    assert.expect(2);

    let afterSaveCalled = false;
    this.afterSave = () => {
      afterSaveCalled = true;
    };

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal
          @report-id={{this.reportId}}
          @afterSave={{this.afterSave}}
        />
      </template>,
    );

    await openModal();
    await selectNewTask();
    await setNewDuration("0:30");
    await click("[data-test-split-report-confirm]");

    assert.dom(".modal-header").doesNotExist("modal is closed after split");
    assert.true(afterSaveCalled, "afterSave is called after successful split");
  });

  test("shows error notification when split endpoint fails", async function (assert) {
    this.owner.register(
      "service:fetch",
      class extends Service {
        async fetch() {
          throw { error: new Error("Internal Server Error") };
        }
      },
    );

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal @report-id={{this.reportId}} />
      </template>,
    );

    await openModal();
    await selectNewTask();
    await setNewDuration("0:30");
    await click("[data-test-split-report-confirm]");

    assert.dom(".modal-header").exists("modal stays open on error");
  });

  test("afterSave is not called when split endpoint fails", async function (assert) {
    this.owner.register(
      "service:fetch",
      class extends Service {
        async fetch() {
          throw { error: new Error("Internal Server Error") };
        }
      },
    );

    let afterSaveCalled = false;
    this.afterSave = () => {
      afterSaveCalled = true;
    };

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal
          @report-id={{this.reportId}}
          @afterSave={{this.afterSave}}
        />
      </template>,
    );

    await openModal();
    await selectNewTask();
    await setNewDuration("0:30");
    await click("[data-test-split-report-confirm]");

    assert.false(afterSaveCalled, "afterSave is not called on error");
  });

  test("afterSave is not called when split is invalid", async function (assert) {
    assert.expect(2);

    let afterSaveCalled = false;
    this.afterSave = () => {
      afterSaveCalled = true;
    };

    await render(
      <template>
        <ModalTarget />
        <SplitReportModal
          @report-id={{this.reportId}}
          @afterSave={{this.afterSave}}
        />
      </template>,
    );

    await openModal();

    assert.dom("[data-test-split-report-confirm]").isDisabled();
    assert.false(afterSaveCalled, "afterSave was not called for invalid split");
  });
});
