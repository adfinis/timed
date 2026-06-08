import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import and from "ember-truth-helpers/helpers/and";
import eq from "ember-truth-helpers/helpers/eq";
import not from "ember-truth-helpers/helpers/not";
import or from "ember-truth-helpers/helpers/or";

import Checkmark from "timed/components/checkmark";
import CustomerVisibleIcon from "timed/components/customer-visible-icon";
import DurationSince from "timed/components/duration-since";
import Modal from "timed/components/modal";
import LowerButton from "timed/components/nav-tabs/lower-button";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Tr from "timed/components/table/tr";
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
        <Table class="table--striped table--activities table">
          <tbody>
            {{#each @controller.sortedActivities as |activity|}}
              {{#let (eq activity.id @controller.editId) as |selected|}}
                {{!template-lint-disable no-invalid-interactive}}
                <Tr
                  title={{unless activity.transferred "Click to edit"}}
                  @striped={{not
                    (or
                      (or activity.transferred activity.active)
                      (eq activity.id @controller.editId)
                    )
                  }}
                  @hover={{not
                    (or activity.transferred activity.active selected)
                  }}
                  data-test-activity-row
                  data-test-activity-row-id={{activity.id}}
                  class="{{if
                      activity.transferred
                      'transferred text-foreground-muted cursor-not-allowed'
                      'cursor-pointer'
                    }}
                    {{if
                      (and activity.active (not selected))
                      'active bg-primary/20'
                    }}
                    {{if
                      selected
                      'selected bg-primary text-foreground-primary'
                    }}
                    last:border-b max-sm:[&>*]:flex"
                  {{on "click" (fn @controller.editActivity activity)}}
                >
                  <Td>
                    {{luxonFormat activity.from "HH:mm"}}
                    -
                    {{#unless activity.active}}
                      {{luxonFormat activity.to "HH:mm"}}
                    {{/unless}}
                  </Td>
                  <Td
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
                  </Td>
                  <Td title={{activity.comment}}>
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
                  </Td>
                  <Td>
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
                  </Td>
                  <Td>
                    {{#if activity.active}}
                      <DurationSince @from={{activity.from}} />
                    {{else}}
                      {{formatDuration activity.duration}}
                    {{/if}}
                  </Td>
                  <Td class="px-4">
                    <div class="grid h-full w-full place-items-end">
                      {{#if activity.active}}
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
                  </Td>
                </Tr>
              {{/let}}
            {{/each}}
          </tbody>
        </Table>
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
