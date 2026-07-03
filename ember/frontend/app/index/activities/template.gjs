import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import { eq } from "ember-truth-helpers";
import { SelectableTable } from "ui-core/components/ui-table";

import Checkmark from "timed/components/checkmark";
import CustomerVisibleIcon from "timed/components/customer-visible-icon";
import DurationSince from "timed/components/duration-since";
import Modal from "timed/components/modal";
import LowerButton from "timed/components/nav-tabs/lower-button";
import formatDuration from "timed/helpers/format-duration";
import luxonFormat from "timed/helpers/luxon-format";

<template>
  <LowerButton
    @onClick={{@controller.generateReportsCheck}}
    id="generate-timesheet"
    title="Generate timesheet for all the activities listed above"
    data-test-activity-generate-timesheet
  >Generate timesheet</LowerButton>

  <div class="activities flex flex-row-reverse">
    <div
      class="activities-edit peer max-lg:[&:not(:empty)]:flex-grow lg:[&:not(:empty)]:basis-1/3"
    >{{outlet}}</div>

    <div class="activities-list flex-grow max-lg:peer-[:not(:empty)]:hidden">
      {{#if @controller.activities}}
        <SelectableTable
          @last={{true}}
          class="table--striped table--activities table"
          as |t|
        >
          <t.tbody>
            {{#each @controller.sortedActivities as |activity|}}
              {{#let activity.active as |isActive|}}
                {{!template-lint-disable no-invalid-interactive}}
                <t.tr
                  title={{unless activity.transferred "Click to edit"}}
                  @disabled={{activity.transferred}}
                  @selected={{eq activity.id @controller.editId}}
                  @accent={{isActive}}
                  data-test-activity-row
                  data-test-activity-row-id={{activity.id}}
                  class="last:border-b max-sm:[&>*]:flex"
                  {{on "click" (fn @controller.editActivity activity)}}
                >
                  <t.td>
                    {{luxonFormat activity.from "HH:mm"}}
                    -
                    {{#unless isActive}}
                      {{luxonFormat activity.to "HH:mm"}}
                    {{/unless}}
                  </t.td>
                  <t.td
                    title="{{activity.task.project.customer.name}} > {{activity.task.project.name}} > {{activity.task.name}}"
                  >
                    {{#if activity.task}}
                      <div>
                        {{activity.task.project.customer.name}}
                        <strong>&gt;</strong>
                        {{activity.task.project.name}}
                        <strong>&gt;</strong>
                        {{activity.task.name}}
                      </div>
                    {{else}}
                      <strong>Unknown task</strong>
                    {{/if}}
                  </t.td>
                  <t.td title={{activity.comment}}>
                    <div class="comment-field">
                      <span
                        class="line-clamp-2 whitespace-pre-line"
                      >{{activity.comment}}</span>
                    </div>
                    {{#if activity.task.project.customerVisible}}
                      <CustomerVisibleIcon
                        class="activity-customer-visible-icon"
                      />
                    {{/if}}
                  </t.td>
                  <t.td>
                    <div><Checkmark
                        @checked={{activity.review}}
                        @highlight={{true}}
                      />
                      Needs review</div>
                    <div><Checkmark
                        @checked={{activity.notBillable}}
                        @highlight={{true}}
                      />
                      Not billable</div>
                  </t.td>
                  <t.td>
                    {{#if isActive}}
                      <DurationSince @from={{activity.from}} />
                    {{else}}
                      {{formatDuration activity.duration}}
                    {{/if}}
                  </t.td>
                  <t.td class="px-4">
                    <div class="grid h-full w-full place-items-end">
                      {{#if isActive}}
                        <button
                          type="button"
                          data-test-stop-activity
                          class="btn btn-danger"
                          {{on "click" (fn @controller.stopActivity activity)}}
                        >
                          <FaIcon @icon="stop" @prefix="fas" />
                        </button>
                      {{else}}
                        <button
                          type="button"
                          data-test-start-activity
                          class="btn btn-success"
                          {{on "click" (fn @controller.startActivity activity)}}
                        >
                          <FaIcon @icon="play" @prefix="fas" />
                        </button>
                      {{/if}}
                    </div>
                  </t.td>
                </t.tr>
              {{/let}}
            {{/each}}
          </t.tbody>
        </SelectableTable>
      {{else}}
        <div class="text-center"><em>No activities yet</em></div>
      {{/if}}
    </div>
  </div>

  <Modal
    class="md:w-[36rem]"
    @visible={{@controller.showOverlappingWarning}}
    as |modal|
  >
    <modal.header>
      <h3>Activities overlap</h3>
    </modal.header>
    <modal.body>
      Overlapping activities will not be taken into account for the timesheet.
    </modal.body>
    <modal.footer class="flex justify-between" data-test-overlapping-warning>
      <button
        class="btn btn-default"
        type="button"
        {{on
          "click"
          (queue
            (fn (mut @controller.showOverlappingWarning) false)
            (fn (mut @controller.showUnknownWarning) false)
          )
        }}
      >Cancel</button>
      <button
        class="btn btn-primary"
        type="button"
        {{on
          "click"
          (if
            @controller.showUnknownWarning
            (fn (mut @controller.showOverlappingWarning) false)
            @controller.generateReports
          )
        }}
      >That's fine</button>
    </modal.footer>
  </Modal>

  <Modal
    class="md:w-[36rem]"
    @visible={{@controller.showUnknownWarning}}
    as |modal|
  >
    <modal.header>
      <h3>Activities contain unknown tasks</h3>
    </modal.header>
    <modal.body>
      Unknown tasks will not be taken into account for the timesheet.
    </modal.body>
    <modal.footer class="flex justify-between" data-test-unknown-warning>
      <button
        class="btn btn-default"
        type="button"
        {{on
          "click"
          (queue
            (fn (mut @controller.showUnknownWarning) false)
            (fn (mut @controller.showOverlappingWarning) false)
          )
        }}
      >Cancel</button>
      <button
        class="btn btn-primary"
        type="button"
        {{on
          "click"
          (if
            @controller.showOverlappingWarning
            (fn (mut @controller.showUnknownWarning) false)
            @controller.generateReports
          )
        }}
      >That's fine</button>
    </modal.footer>
  </Modal>
</template>
