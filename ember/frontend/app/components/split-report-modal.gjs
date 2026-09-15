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
import TaskSelection from "timed/components/task-selection";
import DjangoDurationTransform from "timed/transforms/django-duration";

export default class SplitReportModal extends Component {
  @tracked isModalVisible = false;
  @service fetch;
  @service notify;
  @service store;

  @tracked newTask = null;
  @tracked newComment = "";
  @tracked newDuration = Duration.fromMillis(0);

  @tracked oldTask = null;
  @tracked oldComment = "";
  @tracked oldDuration = Duration.fromMillis(0);

  get report() {
    return this.fetchReport.lastSuccessful?.value;
  }

  fetchReport = task(async () => {
    return await this.store.findRecord("report", this.args["report-id"][0]);
  });

  @action
  async showModal() {
    const report = await this.fetchReport.perform();
    this.oldTask = report.task ?? null;
    this.oldComment = report.comment ?? "";
    this.oldDuration = report.duration ?? Duration.fromMillis(0);
    this.newDuration = Duration.fromMillis(0);
    this.newComment = "";
    this.newTask = null;
    this.isModalVisible = true;
  }

  get remainingOldDuration() {
    const remaining = this.oldDuration.minus(this.newDuration);
    return remaining.as("milliseconds") > 0
      ? remaining
      : Duration.fromMillis(0);
  }

  @action
  onNewDurationChange(value) {
    const totalMs = this.oldDuration.as("milliseconds");
    const ms = Math.min(value?.as("milliseconds") ?? 0, totalMs);
    this.newDuration = Duration.fromMillis(Math.max(ms, 0));
  }

  @action
  onRemainingDurationChange(value) {
    const totalMs = this.oldDuration.as("milliseconds");
    const remainingMs = Math.min(value?.as("milliseconds") ?? 0, totalMs);
    this.newDuration = Duration.fromMillis(Math.max(totalMs - remainingMs, 0));
  }

  get isValidSplit() {
    if (!this.newTask) return false;
    if (!this.newDuration || this.newDuration.as("milliseconds") <= 0) {
      return false;
    }
    if (
      !this.oldDuration ||
      this.newDuration.as("milliseconds") >= this.oldDuration.as("milliseconds")
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
      const reportId = this.args["report-id"][0];
      const durationTransform = DjangoDurationTransform.create();

      await this.fetch.fetch(`/api/v1/reports/${reportId}/split`, {
        method: "POST",
        data: {
          attributes: {
            updated_original_report: {
              task: {
                type: "tasks",
                id: this.oldTask.id,
              },
              comment: this.oldComment,
              duration: durationTransform.serialize(this.remainingOldDuration),
            },
            second_report: {
              task: {
                type: "tasks",
                id: this.newTask.id,
              },
              comment: this.newComment,
              duration: durationTransform.serialize(this.newDuration),
            },
          },
          type: "split-reports",
        },
      });

      this.store.unloadRecord(this.report);

      this.notify.success("Report split successfully.");
      this.isModalVisible = false;
      if (this.args.afterSave && typeof this.args.afterSave === "function") {
        this.args.afterSave();
      }
    } catch {
      this.notify.error("Could not split the report.");
    }
  });

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
        "Only if there is one report selected, and the report is not verified"
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
                  @on-set-task={{fn (mut this.oldTask)}}
                  @task={{this.oldTask}}
                  as |t|
                >
                  <t.customer @dropdownClass="z-[60]" />
                  <t.project @dropdownClass="z-[60]" />
                  <t.task @dropdownClass="z-[60]" />
                </TaskSelection>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">Comment</label>
                  <input
                    value={{this.oldComment}}
                    type="text"
                    {{on
                      "change"
                      (pick "target.value" (fn (mut this.oldComment)))
                    }}
                    class="ember-text-field form-control rounded"
                    aria-label="Comment for original report"
                  />
                </div>
                <Durationpicker
                  @value={{this.remainingOldDuration}}
                  @onChange={{this.onRemainingDurationChange}}
                  @title="Remaining duration"
                />
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-muted-foreground text-sm font-semibold">Second
                  Report</p>
                <TaskSelection @on-set-task={{fn (mut this.newTask)}} as |t|>
                  <t.customer @dropdownClass="z-[60]" />
                  <t.project @dropdownClass="z-[60]" />
                  <t.task @dropdownClass="z-[60]" />
                </TaskSelection>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-medium">Comment</label>
                  <input
                    value={{this.newComment}}
                    type="text"
                    {{on
                      "change"
                      (pick "target.value" (fn (mut this.newComment)))
                    }}
                    class="ember-text-field form-control rounded"
                    aria-label="Comment for new report"
                  />
                </div>
                <Durationpicker
                  @value={{this.newDuration}}
                  @onChange={{this.onNewDurationChange}}
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
