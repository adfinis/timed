import { on } from "@ember/modifier";
import { LinkTo } from "@ember/routing";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import can from "ember-can/helpers/can";
import perform from "ember-concurrency/helpers/perform";
import { eq, not } from "ember-truth-helpers";
import LoadingIcon from "ui-core/components/loading-icon";
import Card from "ui-core/components/ui-card";

import Empty from "timed/components/empty";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Th from "timed/components/table/th";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import humanizeDuration from "timed/helpers/humanize-duration";
import luxonFormat from "timed/helpers/luxon-format";
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
                <Table class="table--striped table">
                  <Thead>
                    <Tr>
                      <Th>Valid as of</Th>
                      <Th>Days</Th>
                      <Th>Type</Th>
                      <Th>Comment</Th>
                    </Tr>
                  </Thead>
                  <tbody>
                    {{#each absenceCredits as |absenceCredit|}}
                      <Tr
                        @striped={{true}}
                        @hover={{can "edit absence-credit"}}
                        @last={{true}}
                        role="link"
                        {{on
                          "click"
                          (perform
                            @controller.editAbsenceCredit absenceCredit.id
                          )
                        }}
                      >
                        <Td>{{luxonFormat absenceCredit.date "dd.MM.yyyy"}}</Td>
                        <Td>{{absenceCredit.days}}</Td>
                        <Td>{{absenceCredit.absenceType.name}}</Td>
                        <Td>{{absenceCredit.comment}}</Td>
                      </Tr>
                    {{/each}}
                  </tbody>
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
                <Table class="table--striped table">
                  <Thead>
                    <Tr>
                      <Th>Valid as of</Th>
                      <Th>Duration</Th>
                      <Th>Comment</Th>
                    </Tr>
                  </Thead>
                  <tbody>
                    {{#each overtimeCredits as |overtimeCredit|}}
                      <Tr
                        @striped={{true}}
                        @hover={{can "edit overtime-credit"}}
                        @last={{true}}
                        role="link"
                        {{on
                          "click"
                          (perform
                            @controller.editOvertimeCredit overtimeCredit.id
                          )
                        }}
                      >
                        <Td>{{luxonFormat
                            overtimeCredit.date
                            "dd.MM.yyyy"
                          }}</Td>
                        <Td>{{humanizeDuration
                            overtimeCredit.duration
                            false
                          }}</Td>
                        <Td>{{overtimeCredit.comment}}</Td>
                      </Tr>
                    {{/each}}
                  </tbody>
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
