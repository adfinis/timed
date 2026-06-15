import { hash, fn } from "@ember/helper";
import { on } from "@ember/modifier";
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didUpdate from "@ember/render-modifiers/modifiers/did-update";
import { LinkTo } from "@ember/routing";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";
import { not } from "ember-truth-helpers";
import Card from "ui-core/components/ui-card";
import UiCheckbox from "ui-core/components/ui-checkbox";

import ReportComment from "timed/components/report-comment";
import TaskSelection from "timed/components/task-selection";
import Timepicker from "timed/components/timepicker";

<template>
  <label hidden for="activity-edit-form">Edit activity</label>
  <form
    id="activity-edit-form"
    class="pl-2"
    data-test-activity-edit-form
    {{on "submit" @controller.save}}
  >
    <Card class="grid" as |c|>
      <c.block class="grid gap-2 p-2">
        <TaskSelection
          @initial={{hash task=@controller.changeset.task}}
          @task={{@controller.changeset.task}}
          @on-set-task={{fn @controller.setTask @controller.changeset}}
          as |t|
        >
          <div class="form-group">{{t.customer}}</div>
          <div class="form-group">{{t.project}}</div>
          <div
            class="form-group"
            {{didUpdate t.reset @model.task.id}}
          >{{t.task}}</div>
        </TaskSelection>
      </c.block>
      <c.footer class="text-right">
        <div class="form-group">
          <label hidden for="comment">Comment</label>
          <ReportComment
            @value={{@controller.changeset.comment}}
            @customerVisible={{@controller.changeset.task.project.customerVisible}}
            @onChange={{fn (mut @controller.changeset.comment)}}
            @onSubmit={{@controller.save}}
          />
        </div>
        <div
          class="form-group checkboxes flex justify-between p-2 [&>*]:grid [&>*]:w-full [&>*]:grid-cols-[auto,minmax(0,1fr)] [&>*]:items-center [&>*]:justify-items-start [&>*]:gap-x-2"
        >
          <UiCheckbox
            data-test-activity-review
            @checked={{@controller.changeset.review}}
            @label="Needs review"
            @onChange={{toggle "review" @controller.changeset}}
          />
          <UiCheckbox
            data-test-activity-not-billable
            @checked={{@controller.changeset.notBillable}}
            @label="Not billable"
            @onChange={{toggle "notBillable" @controller.changeset}}
          />
        </div>
        <table class="table--striped table--activity-edit table w-full">
          <tbody>
            <tr data-test-activity-block-row>
              <td
                class="form-group
                  {{if @controller.changeset.error.from 'has-error'}}"
              >
                <Timepicker
                  @value={{@controller.changeset.from}}
                  @max={{@controller.changeset.to}}
                  @precision={{1}}
                  @onFocusOut={{fn
                    @controller.validateChangeset
                    @controller.changeset
                  }}
                  @onChange={{fn (mut @controller.changeset.from)}}
                />
              </td>
              <td>-</td>
              <td
                class="form-group
                  {{if @controller.changeset.error.to 'has-error'}}"
              >
                <Timepicker
                  @value={{@controller.changeset.to}}
                  @min={{@controller.changeset.from}}
                  @precision={{1}}
                  @disabled={{if @controller.changeset.active true}}
                  @onFocusOut={{fn
                    @controller.validateChangeset
                    @controller.changeset
                  }}
                  @onChange={{fn (mut @controller.changeset.to)}}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </c.footer>
      <c.footer class="flex justify-between text-right">
        <LinkTo
          @route="index.activities"
          class="btn btn-default lg:hidden"
          role="button"
          data-test-activity-edit-form-cancel
        >Cancel</LinkTo>
        <div class="flex gap-2 lg:w-full lg:justify-between">
          <button
            class="btn btn-danger"
            type="button"
            disabled={{@model.active}}
            {{on "click" @controller.delete}}
            data-test-activity-edit-form-delete
          >Delete</button>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={{not @controller.saveEnabled}}
            data-test-activity-edit-form-save
          >Save</button>
        </div>
      </c.footer>
    </Card>
  </form>
</template>
