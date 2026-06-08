import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";

import Card from "timed/components/card";
import Empty from "timed/components/empty";
import LoadingIcon from "timed/components/loading-icon";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Th from "timed/components/table/th";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import humanizeDuration from "timed/helpers/humanize-duration";
import luxonFormat from "timed/helpers/luxon-format";
<template>
  <div
    class="grid-rows-min grid gap-2 md:grid-cols-2 lg:grid-cols-3 [&>*]:h-min"
  >

    <Card as |c|>
      <c.header><h4>General information</h4></c.header>
      <c.block>
        <Table class="user-general-info">
          <tbody class="[&>tr>td:last-child]:text-right [&>tr>td]:py-1">
            <tr>
              <td>Email:</td>
              <td>{{@controller.model.email}}</td>
            </tr>
            <tr>
              <td>Username:</td>
              <td>{{@controller.model.username}}</td>
            </tr>
            {{#if @controller.model.activeEmployment}}
              <tr>
                <td>Location:</td>
                <td>{{@controller.model.activeEmployment.location.name}}</td>
              </tr>
              <tr>
                <td>Contract type:</td>
                <td>{{if
                    @controller.model.activeEmployment.isExternal
                    "External"
                    "Internal"
                  }}</td>
              </tr>
              <tr>
                <td>Percentage:</td>
                <td>{{@controller.model.activeEmployment.percentage}}%</td>
              </tr>
              <tr>
                <td>Worktime:</td>
                <td>{{humanizeDuration
                    @controller.model.activeEmployment.worktimePerDay
                    false
                  }}</td>
              </tr>
            {{/if}}
          </tbody>
        </Table>
      </c.block>
      <c.footer />
    </Card>

    <Card as |c|>
      <c.header><h4>Employments</h4></c.header>
      <c.block>
        {{#if @controller.employments.isRunning}}
          <Empty>
            <LoadingIcon />
          </Empty>
        {{else}}
          {{#let @controller.employments.lastSuccessful.value as |employments|}}
            {{#if employments}}
              <Table class="table--striped table">
                <Thead>
                  <Tr>
                    <Th>Location</Th>
                    <Th>Percentage</Th>
                    <Th>Start</Th>
                    <Th>End</Th>
                  </Tr>
                </Thead>
                <tbody>
                  {{#each employments as |employment|}}
                    <Tr @striped={{true}} @last={{true}}>
                      <Td>{{employment.location.name}}</Td>
                      <Td>{{employment.percentage}}%</Td>
                      <Td>{{luxonFormat employment.start "dd.MM.yyyy"}}</Td>
                      <Td>{{if
                          employment.end
                          (luxonFormat employment.end "dd.MM.yyyy")
                          "-"
                        }}</Td>
                    </Tr>
                  {{/each}}
                </tbody>
              </Table>
            {{else}}
              <Empty class="card-block">
                <FaIcon @icon="briefcase" @prefix="fas" />
                <p>
                  No employments found...
                </p>
              </Empty>
            {{/if}}
          {{/let}}
        {{/if}}
      </c.block>
      <c.footer />
    </Card>

    <Card as |c|>
      <c.header><h4>Absences</h4></c.header>
      <c.block>
        {{#if @controller.absences.isRunning}}
          <Empty>
            <LoadingIcon />
          </Empty>
        {{else}}
          {{#let @controller.absences.lastSuccessful.value as |absences|}}
            {{#if absences}}
              <Table class="table--striped table">
                <Thead>
                  <Tr class="text-left [&>*]:p-2">
                    <Th>Type</Th>
                    <Th>Date</Th>
                    <Th>Comment</Th>
                  </Tr>
                </Thead>
                <tbody>
                  {{#each absences as |absence|}}
                    <Tr @striped={{true}} @last={{true}}>
                      <Td>{{absence.absenceType.name}}</Td>
                      <Td>{{luxonFormat absence.date "dd.MM.yyyy"}}</Td>
                      <Td>{{absence.comment}}</Td>
                    </Tr>
                  {{/each}}
                </tbody>
              </Table>
            {{else}}
              <Empty class="card-block">
                <FaIcon @icon="calendar-xmark" />
                <p>
                  No absences found...
                </p>
              </Empty>
            {{/if}}
          {{/let}}
        {{/if}}
      </c.block>
      <c.footer />
    </Card>
  </div>
</template>
