import { on } from "@ember/modifier";
import { LinkTo } from "@ember/routing";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import can from "ember-can/helpers/can";
import perform from "ember-concurrency/helpers/perform";
import { eq, not } from "ember-truth-helpers";
import LoadingIcon from "ui-core/components/loading-icon";
import Card from "ui-core/components/ui-card";
import Table from "ui-core/components/ui-table";
import { dateToString } from "ui-core/utils/date";

import Empty from "timed/components/empty";
import humanizeDuration from "timed/helpers/humanize-duration";

<template>
  <div class="grid gap-2 sm:grid-cols-2">
    <div class="year-select col-span-full flex justify-end gap-2">
      {{#if @controller.allowTransfer}}
        <button
          type="button"
          class="btn btn-success"
          {{on "click" (perform @controller.transfer)}}
        >Transfer</button>
      {{/if}}

      {{#let @controller.years.lastSuccessful.value as |years|}}
        <label for="credit-year-select" hidden>
          Select year
        </label>
        <select
          id="credit-year-select"
          class="form-control rounded sm:!w-auto"
          {{on "change" (pick "target.value" @controller.fetchData)}}
        >
          {{#each years as |y|}}
            <option
              value={{y}}
              selected={{eq y @controller.year}}
            >{{y}}</option>
          {{/each}}
          <option value selected={{not @controller.year}}>All</option>
        </select>
      {{/let}}
    </div>

    <Card
      class="grid grid-rows-[min-content,1fr,min-content]"
      data-test-absence-credits
      as |c|
    >
      <c.header><h4>Absence credits</h4></c.header>
      {{#let (can "create absence-credit") as |canCreate|}}
        <c.block>
          {{#if @controller.absenceCredits.isRunning}}
            <Empty>
              <LoadingIcon />
            </Empty>
          {{else}}
            {{#let
              @controller.absenceCredits.lastSuccessful.value
              as |absenceCredits|
            }}
              {{#if absenceCredits}}
                <Table
                  @striped={{true}}
                  @hover={{can "edit absence-credit"}}
                  @last={{true}}
                  as |t|
                >
                  <t.thead>
                    <t.trh>
                      <t.th>Valid as of</t.th>
                      <t.th>Days</t.th>
                      <t.th>Type</t.th>
                      <t.th>Comment</t.th>
                    </t.trh>
                  </t.thead>
                  <t.tbody>
                    {{#each absenceCredits as |absenceCredit|}}
                      <t.tr
                        role="link"
                        {{on
                          "click"
                          (perform
                            @controller.editAbsenceCredit absenceCredit.id
                          )
                        }}
                      >
                        <t.td>{{dateToString absenceCredit.date}}</t.td>
                        <t.td>{{absenceCredit.days}}</t.td>
                        <t.td>{{absenceCredit.absenceType.name}}</t.td>
                        <t.td>{{absenceCredit.comment}}</t.td>
                      </t.tr>
                    {{/each}}
                  </t.tbody>
                </Table>
              {{else}}
                <Empty>
                  <FaIcon @icon="calendar-plus" />
                  <p>
                    No absence credits found...</p>
                  {{#if canCreate}}
                    <p>Add a new credit by clicking the button below!</p>
                  {{/if}}
                </Empty>
              {{/if}}

            {{/let}}
          {{/if}}
        </c.block>
        <c.footer>
          {{#if canCreate}}
            <LinkTo
              @route="users.edit.credits.absence-credits.new"
              class="btn btn-primary block w-min whitespace-nowrap"
            >Add new credit</LinkTo>
          {{/if}}
        </c.footer>
      {{/let}}
    </Card>

    <Card
      class="grid grid-rows-[min-content,1fr,min-content]"
      data-test-overtime-credits
      as |c|
    >
      {{#let (can "create overtime-credit") as |canCreate|}}
        <c.header><h4>Overtime credits</h4></c.header>
        {{#if @controller.overtimeCredits.isRunning}}
          <Empty>
            <LoadingIcon />
          </Empty>
        {{else}}
          {{#let
            @controller.overtimeCredits.lastSuccessful.value
            as |overtimeCredits|
          }}
            <c.block>
              {{#if overtimeCredits}}
                <Table
                  @hover={{can "edit overtime-credit"}}
                  @striped={{true}}
                  @last={{true}}
                  as |t|
                >
                  <t.thead>
                    <t.trh>
                      <t.th>Valid as of</t.th>
                      <t.th>Duration</t.th>
                      <t.th>Comment</t.th>
                    </t.trh>
                  </t.thead>
                  <t.tbody>
                    {{#each overtimeCredits as |overtimeCredit|}}
                      <t.tr
                        role="link"
                        {{on
                          "click"
                          (perform
                            @controller.editOvertimeCredit overtimeCredit.id
                          )
                        }}
                      >
                        <t.td>{{dateToString overtimeCredit.date}}</t.td>
                        <t.td>{{humanizeDuration
                            overtimeCredit.duration
                            false
                          }}</t.td>
                        <t.td>{{overtimeCredit.comment}}</t.td>
                      </t.tr>
                    {{/each}}
                  </t.tbody>
                </Table>
                {{#if (can "create overtime-credit")}}{{/if}}
              {{else}}
                <Empty>
                  <FaIcon @icon="clock" />
                  <p>
                    No overtime credits found...</p>

                  {{#if canCreate}}
                    <p>Add a new credit by clicking the button below!</p>
                  {{/if}}
                </Empty>
              {{/if}}
            </c.block>
          {{/let}}
        {{/if}}
        <c.footer>
          {{#if canCreate}}
            <LinkTo
              @route="users.edit.credits.overtime-credits.new"
              class="btn btn-primary w-min whitespace-nowrap"
            >Add new credit</LinkTo>
          {{/if}}

        </c.footer>
      {{/let}}
    </Card>
  </div>
</template>
