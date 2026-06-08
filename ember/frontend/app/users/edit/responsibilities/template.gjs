import Card from "timed/components/card";
import Empty from "timed/components/empty";
import LoadingIcon from "timed/components/loading-icon";
import UiTable from "ui-core/components/ui-table";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Table from "timed/components/table";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import Th from "timed/components/table/th";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import Td from "timed/components/table/td";
import balanceHighlightClass from "timed/helpers/balance-highlight-class";
import formatDuration from "timed/helpers/format-duration";
import await from "ember-promise-helpers/helpers/await";
<template><div class="grid gap-2 md:grid-cols-2">

  <Card class="grid grid-rows-[min-content,1fr,min-content]" as |c|>
    <c.header><h4>Projects</h4></c.header>
    <c.block>
      {{#if @controller.projects.isRunning}}
        <Empty>
          <LoadingIcon />
        </Empty>
      {{else}}
        {{#let @controller.projects.lastSuccessful.value as |projects|}}
          {{#if projects}}
            <UiTable @striped={{true}} as |t|>
              <t.thead>
                <t.tr>
                  <t.th>Customer</t.th>
                  <t.th>Project</t.th>
                </t.tr>
              </t.thead>
              <tbody>
                {{#each projects as |project|}}
                  <t.tr @striped={{true}} @last={{true}}>
                    <t.td>{{project.customer.name}}</t.td>
                    <t.td>{{project.name}}</t.td>
                  </t.tr>
                {{/each}}
              </tbody>
            </UiTable>
          {{else}}
            <Empty>
              <FaIcon @icon="folder-open" />
              <p>
                No projects found...
              </p>
            </Empty>
          {{/if}}
        {{/let}}
      {{/if}}
    </c.block>
    <c.footer />
  </Card>

  <Card class="grid grid-rows-[min-content,1fr,min-content]" as |c|>
    <c.header><h4>Supervisees</h4></c.header>
    <c.block>
      {{#if @controller.supervisees.isRunning}}
        <Empty>
          <LoadingIcon />
        </Empty>
      {{else}}
        {{#let @controller.supervisees.lastSuccessful.value as |supervisees|}}
          {{#if supervisees}}
            <Table class="table--striped table">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Current worktime balance</Th>
                  <Th>Remaining vacation days</Th>
                </Tr>
              </Thead>
              <tbody>
                {{#each supervisees as |supervisee|}}
                  <Tr @striped={{true}} @last={{true}} @hover={{true}} role="link" {{on "click" (fn @controller.openSupervisorProfile supervisee.id)}}>
                    <Td>{{supervisee.fullName}}</Td>
                    <Td>
                      <span class="worktime-balance
                          {{balanceHighlightClass supervisee.currentWorktimeBalance.balance}}">
                        {{formatDuration supervisee.currentWorktimeBalance.balance false}}
                      </span>
                    </Td>

                    {{!--
                      absenceBalances has to be an array but will always only
                      contain one element. This is why we get the first object here.
                    --}}
                    <Td>{{await (@controller.getBalance supervisee)}}</Td>
                  </Tr>
                {{/each}}
              </tbody>
            </Table>
          {{else}}
            <Empty>
              <FaIcon @icon="users" @prefix="fas" />
              <p>No supervisees found...</p>
            </Empty>
          {{/if}}
        {{/let}}
      {{/if}}
    </c.block>
    <c.footer />
  </Card>
</div></template>