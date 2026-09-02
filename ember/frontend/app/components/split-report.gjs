import { getOwner } from "@ember/application";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency";
import perform from "ember-concurrency/helpers/perform";
import ValidatedForm from "ember-validated-form/components/validated-form";
import { Duration } from "luxon";
import Card from "ui-core/components/ui-card";
import Durationpicker from "ui-core/components/ui-durationpicker";

import Checkbox from "timed/components/checkbox";
import ReportComment from "timed/components/report-comment";
import TaskSelection from "timed/components/task-selection";
import Void from "timed/components/void";
import DjangoDurationTransform from "timed/transforms/django-duration";
import {
  serializeQueryParams,
  allQueryParams,
  queryParamsState,
} from "timed/utils/query-params";
import SplitReport from "timed/utils/split-report";

export default class SplitReportComponent extends Component {
  queryParams = [
    "customer",
    "costCenter",
    "project",
    "task",
    "user",
    "reviewer",
    "billingType",
    "costCenter",
    "fromDate",
    "toDate",
    "review",
    "notBillable",
    "verified",
    "billed",
    "ordering",
    "editable",
    "rejected",
    "id",
  ];

  @service fetch;
  @service router;
  @service notify;

  @tracked id;
  @tracked originalUpdatedReport;
  @tracked secondReport;

  constructor(...args) {
    super(...args);

    const secondReportDuration = Duration.fromDurationLike({ minutes: 15 });
    const originalUpdatedReportDuration = Duration.fromDurationLike({
      minutes:
        this.originalReport.duration.as("minutes") -
        secondReportDuration.as("minutes"),
    });

    this.originalUpdatedReport = new SplitReport({
      task: this.originalReport.task,
      comment: this.originalReport.comment,
      duration: originalUpdatedReportDuration,
      notBillable: this.originalReport.notBillable,
      review: this.originalReport.review,
    });

    this.secondReport = new SplitReport({ duration: secondReportDuration });
  }

  get analysisIndexController() {
    return getOwner(this).lookup("controller:analysis.index");
  }

  get originalReport() {
    return this.args.report;
  }

  get totalDuration() {
    return this.originalReport.duration;
  }

  get oldReportDuration() {
    return this.originalUpdatedReport.duration;
  }

  get secondReportDuration() {
    return Duration.fromDurationLike({
      minutes:
        this.totalDuration.as("minutes") - this.oldReportDuration.as("minutes"),
    });
  }

  get durationpickerMin() {
    return Duration.fromDurationLike({ minutes: 15 });
  }

  get durationpickerMax() {
    return Duration.fromDurationLike({
      minutes:
        this.totalDuration.as("minutes") - this.durationpickerMin.as("minutes"),
    });
  }

  get isValidSplit() {
    // check if split is valid
    return true;
  }

  @action
  cancel() {
    const task = this.analysisIndexController.data;

    if (task.lastSuccessful) {
      this.analysisIndexController.skipResetOnSetup = true;
    }
    this.router
      .transitionTo("analysis.index", {
        queryParams: {
          ...serializeQueryParams(allQueryParams(this), queryParamsState(this)),
        },
      })
      .then(() => {
        this.analysisIndexController.skipResetOnSetup = false;
      });
  }

  @action
  onSecondReportDurationChange(newDuration) {
    this.originalUpdatedReport.duration = Duration.fromDurationLike({
      minutes: this.totalDuration.as("minutes") - newDuration.as("minutes"),
    });
  }

  save = task(async () => {
    if (!this.isValidSplit) {
      this.notify.error(
        "Please select a task and enter a valid duration for the new and old report.",
      );
      return;
    }

    const durationTransform = DjangoDurationTransform.create();
    const reportId = this.originalReport.id;

    try {
      await this.fetch.fetch(`/api/v1/reports/${reportId}/split`, {
        method: "POST",
        data: {
          attributes: {
            updated_original_report: {
              task: {
                type: "tasks",
                id: this.originalUpdatedReport.task.id,
              },
              comment: this.originalUpdatedReport.comment,
              duration: durationTransform.serialize(
                this.originalUpdatedReport.duration,
              ),
              not_billable: this.originalUpdatedReport.notBillable,
              review: this.originalUpdatedReport.review,
            },
            second_report: {
              task: {
                type: "tasks",
                id: this.secondReport.task.id,
              },
              comment: this.secondReport.comment,
              duration: durationTransform.serialize(this.secondReportDuration),
              not_billable: this.secondReport.notBillable,
              review: this.secondReport.review,
            },
          },
          type: "split-reports",
        },
      });
      this.notify.success("Report split successfully.");
    } catch {
      this.notify.error("Could not split the report.");
    }
  });

  <template>
    <div class="grid md:grid-cols-4">
      <div class="grid-cell"></div>
      <div class="grid-cell col-span-2">
        <ValidatedForm @on-submit={{perform this.save}} as |f|>
          <Card as |c|>
            <c.header>
              <h1 class="text-foreground text-center">
                Split Report
              </h1>
            </c.header>
            <div class="flex flex-row gap-4 p-4">
              <div class="WIP-old-report flex w-1/2 flex-col gap-2">
                <h2>Old Report</h2>
                <TaskSelection
                  @on-set-task={{fn (mut this.originalUpdatedReport.task)}}
                  @task={{this.originalUpdatedReport.task}}
                  as |t|
                >
                  <t.customer @dropdownClass="z-[60]" />
                  <t.project @dropdownClass="z-[60]" />
                  <t.task @dropdownClass="z-[60]" />
                </TaskSelection>
                <label for="comment">
                  Comment
                  <ReportComment
                    @value={{this.originalUpdatedReport.comment}}
                    @onChange={{fn (mut this.originalUpdatedReport.comment)}}
                  />
                </label>
                <div class="grid gap-1">
                  <f.input @name="notBillable" @labelComponent={{Void}}>
                    <Checkbox
                      data-test-not-billable
                      @checked={{this.originalUpdatedReport.notBillable}}
                      @onChange={{fn
                        (mut this.originalUpdatedReport.notBillable)
                      }}
                    >
                      Not billable
                    </Checkbox>
                  </f.input>
                  <f.input @name="review" @labelComponent={{Void}}>
                    <Checkbox
                      data-test-review
                      @checked={{this.originalUpdatedReport.review}}
                      @onChange={{fn (mut this.originalUpdatedReport.review)}}
                    >
                      Needs Review
                    </Checkbox>
                  </f.input>
                </div>
                <Durationpicker
                  name="duration"
                  @min={{this.durationpickerMin}}
                  @max={{this.durationpickerMax}}
                  @value={{this.originalUpdatedReport.duration}}
                  @onChange={{fn (mut this.originalUpdatedReport.duration)}}
                />
              </div>

              <div class="WIP-second-report flex w-1/2 flex-col gap-2">
                <h2>Second Report</h2>
                <TaskSelection
                  @on-set-task={{fn (mut this.secondReport.task)}}
                  @task={{this.secondReport.task}}
                  as |t|
                >
                  <t.customer @dropdownClass="z-[60]" />
                  <t.project @dropdownClass="z-[60]" />
                  <t.task @dropdownClass="z-[60]" />
                </TaskSelection>
                <label for="comment">
                  Comment
                  <ReportComment
                    @onChange={{fn (mut this.secondReport.comment)}}
                  />
                </label>
                <div class="grid gap-1">
                  <f.input @name="notBillable" @labelComponent={{Void}}>
                    <Checkbox
                      data-test-not-billable
                      @checked={{this.secondReport.notBillable}}
                      @onChange={{fn (mut this.secondReport.notBillable)}}
                    >
                      Not billable
                    </Checkbox>
                  </f.input>
                  <f.input @name="review" @labelComponent={{Void}}>
                    <Checkbox
                      data-test-review
                      @checked={{this.secondReport.review}}
                      @onChange={{fn (mut this.secondReport.review)}}
                    >
                      Needs Review
                    </Checkbox>
                  </f.input>
                </div>
                <Durationpicker
                  name="duration"
                  @min={{this.durationpickerMin}}
                  @max={{this.durationpickerMax}}
                  @value={{this.secondReportDuration}}
                  @onChange={{this.onSecondReportDurationChange}}
                />
              </div>
            </div>
            <c.footer>
              <div class="relative flex">
                <button
                  data-test-cancel
                  type="button"
                  class="btn btn-default"
                  {{on "click" this.cancel}}
                >Cancel</button>
                <f.submit class="absolute right-0" />
              </div>
            </c.footer>
          </Card>
        </ValidatedForm>
      </div>
    </div>
  </template>
}
