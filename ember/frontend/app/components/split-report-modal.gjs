import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import { task } from "ember-concurrency";
import perform from "ember-concurrency/helpers/perform";
import { not, or } from "ember-truth-helpers";
import { Duration } from "luxon";

import Durationpicker from "timed/components/durationpicker";
import Modal from "timed/components/modal";
import SplitReport from "timed/components/splitReport";
import TaskSelection from "timed/components/task-selection";
import DjangoDurationTransform from "timed/transforms/django-duration";

export default class SplitReportModal extends Component {
  @service fetch;
  @service notify;
  @service store;

  @tracked isModalVisible = false;
  @tracked oldReport = null;
  @tracked newReport = null;

  get originalReport() {
    return this.fetchOriginalReport.lastSuccessful?.value;
  }

  fetchOriginalReport = task(async () => {
    return await this.store.findRecord("report", this.args.reportId[0]);
  });

  @action
  async showModal() {
    const originalReport = await this.fetchOriginalReport.perform();
    this.oldReport = new SplitReport(
      originalReport.task,
      originalReport.comment,
      originalReport.duration,
    );
    this.newReport = new SplitReport();
    this.isModalVisible = true;
  }

  getRemainingDuration(report) {
    const remaining = this.originalReport.duration.minus(report.duration);
    return remaining.as("minutes") > 0 ? remaining : Duration.fromMillis(0);
  }

  validateDuration(value) {
    const min = value?.as("minutes") ?? 0;
    const totalMin = this.originalReport.duration.as("minutes");
    if (min < 0) {
      return Duration.fromMillis(0);
    }
    return Duration.fromDurationLike({ minutes: Math.min(min, totalMin) });
  }

  @action
  onNewReportDurationChange(value) {
    this.newReport.duration = this.validateDuration(value);
    this.oldReport.duration = this.getRemainingDuration(this.newReport);
  }

  @action
  onOldReportDurationChange(value) {
    this.oldReport.duration = this.validateDuration(value);
    this.newReport.duration = this.getRemainingDuration(this.oldReport);
  }

  get isValidSplit() {
    if (!this.newReport.task) return false;
    if (
      !this.newReport.duration ||
      this.newReport.duration.as("minutes") <= 0
    ) {
      return false;
    }
    if (
      !this.originalReport.duration ||
      this.newReport.duration.as("minutes") >=
        this.originalReport.duration.as("minutes")
    ) {
      return false;
    }
    return true;
  }

  splitReport = task(async () => {
    if (!this.isValidSplit) {
      this.notify.error(
        "Please select a task and enter a valid duration for the new report.",
      );
      return;
    }

    try {
      const reportId = this.args.reportId[0];
      const durationTransform = DjangoDurationTransform.create();

      await this.fetch.fetch(`/api/v1/reports/${reportId}/split`, {
        method: "POST",
        data: {
          attributes: {
            updated_original_report: {
              task: {
                type: "tasks",
                id: this.oldReport.task.id,
              },
              comment: this.oldReport.comment,
              duration: durationTransform.serialize(this.oldReport.duration),
            },
            second_report: {
              task: {
                type: "tasks",
                id: this.newReport.task.id,
              },
              comment: this.newReport.comment,
              duration: durationTransform.serialize(this.newReport.duration),
            },
          },
          type: "split-reports",
        },
      });

      this.notify.success("Report split successfully.");
      this.isModalVisible = false;
      this.updateOriginalReport();
      if (this.args.afterSave && typeof this.args.afterSave === "function") {
        this.args.afterSave();
      }
    } catch {
      this.notify.error("Could not split the report.");
    }
  });

  updateOriginalReport() {
    this.originalReport.task = this.oldReport.task;
    this.originalReport.comment = this.oldReport.comment;
    this.originalReport.duration = this.oldReport.duration;
  }

  @action
  closeModal() {
    this.isModalVisible = false;
  }

  <template>
    <button
      data-test-split-report
      type="button"
      class="btn btn-success"
      {{on "click" this.showModal}}
      disabled={{@disabled}}
      title={{if
        @disabled
        "Splitting a report is only allowed, when there's only one report selected, which isn't verified yet."
      }}
      ...attributes
    >
      Split Report
    </button>
    {{#if this.isModalVisible}}
      <Modal
        @visible={{this.isModalVisible}}
        @onClose={{this.closeModal}}
        @closeOnBackdropClick={{false}}
        class="md:w-auto"
        as |modal|
      >
        <div class="sm:min-w-[64rem]">
          <modal.header>
            <h3>Split Report</h3>
          </modal.header>
          <modal.body>
            <div class="grid grid-cols-2 gap-6">

              <div class="flex flex-col gap-2">
                <p class="text-muted-foreground text-sm font-semibold">Original
                  report</p>
                <TaskSelection
                  @on-set-task={{fn (mut this.oldReport.task)}}
                  @task={{this.oldReport.task}}
                  as |t|
                >
                  <t.customer @dropdownClass="z-[60]" />
                  <t.project @dropdownClass="z-[60]" />
                  <t.task @dropdownClass="z-[60]" />
                </TaskSelection>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">Comment</label>
                  <input
                    value={{this.oldReport.comment}}
                    type="text"
                    {{on
                      "change"
                      (pick "target.value" (fn (mut this.oldReport.comment)))
                    }}
                    class="ember-text-field form-control rounded"
                    aria-label="Comment for original report"
                  />
                </div>
                <Durationpicker
                  @value={{this.oldReport.duration}}
                  @onChange={{this.onOldReportDurationChange}}
                  @title="Remaining duration"
                />
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-muted-foreground text-sm font-semibold">Second
                  Report</p>
                <TaskSelection
                  @on-set-task={{fn (mut this.newReport.task)}}
                  as |t|
                >
                  <t.customer @dropdownClass="z-[60]" />
                  <t.project @dropdownClass="z-[60]" />
                  <t.task @dropdownClass="z-[60]" />
                </TaskSelection>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">Comment</label>
                  <input
                    value={{this.newReport.comment}}
                    type="text"
                    {{on
                      "change"
                      (pick "target.value" (fn (mut this.newReport.comment)))
                    }}
                    class="ember-text-field form-control rounded"
                    aria-label="Comment for new report"
                  />
                </div>
                <Durationpicker
                  @value={{this.newReport.duration}}
                  @onChange={{this.onNewReportDurationChange}}
                  @title="Duration for new report"
                />
              </div>

            </div>
          </modal.body>
          <modal.footer class="flex gap-2">
            <button
              class="btn btn-default"
              type="button"
              data-test-split-report-cancel
              {{on "click" this.closeModal}}
            >
              Cancel
            </button>
            <button
              class="btn btn-primary ms-auto"
              type="button"
              data-test-split-report-confirm
              {{on "click" (perform this.splitReport)}}
              disabled={{or (not this.isValidSplit) this.splitReport.isRunning}}
            >
              Split
            </button>
          </modal.footer>
        </div>
      </Modal>
    {{/if}}
  </template>
}
