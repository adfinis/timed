import { service } from "@ember/service";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import { DateTime } from "luxon";
import { trackedTask } from "reactiveweb/ember-concurrency";
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

export default class UsersEditIndexTemplate extends Component {
  @service store;

  absencesTask = task(async (user) => {
    return await this.store.query("absence", {
      user,
      ordering: "-date",

      from_date: DateTime.now().startOf("year").toISODate(),
      include: "absence_type",
    });
  });

  employmentsTask = task(
    async (user) =>
      await this.store.query("employment", {
        user,
        ordering: "-start_date",
        include: "location",
      }),
  );

  absences = trackedTask(this, this.absencesTask, () => [this.args.model.id]);
  employments = trackedTask(this, this.employmentsTask, () => [
    this.args.model.id,
  ]);

  <template>
    <div
      class="grid-rows-min grid gap-2 md:grid-cols-2 lg:grid-cols-3 [&>*]:h-min"
    >

      <Card data-test-general-information as |c|>
        <c.header><h4>General information</h4></c.header>
        <c.block>
          <Table class="user-general-info">
            <tbody class="[&>tr>td:last-child]:text-right [&>tr>td]:py-1">
              <tr>
                <td>Email:</td>
                <td>{{@model.email}}</td>
              </tr>
              <tr>
                <td>Username:</td>
                <td>{{@model.username}}</td>
              </tr>
              {{#if @model.activeEmployment}}
                <tr>
                  <td>Location:</td>
                  <td>{{@model.activeEmployment.location.name}}</td>
                </tr>
                <tr>
                  <td>Contract type:</td>
                  <td>{{if
                      @model.activeEmployment.isExternal
                      "External"
                      "Internal"
                    }}</td>
                </tr>
                <tr>
                  <td>Percentage:</td>
                  <td>{{@model.activeEmployment.percentage}}%</td>
                </tr>
                <tr>
                  <td>Worktime:</td>
                  <td>{{humanizeDuration
                      @model.activeEmployment.worktimePerDay
                      false
                    }}</td>
                </tr>
              {{/if}}
            </tbody>
          </Table>
        </c.block>
        <c.footer />
      </Card>

      <Card data-test-employments as |c|>
        <c.header><h4>Employments</h4></c.header>
        <c.block>
          {{#if this.employments.isRunning}}
            <Empty>
              <LoadingIcon />
            </Empty>
          {{else}}
            {{#let this.employments.value as |employments|}}
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

      <Card data-test-absences as |c|>
        <c.header><h4>Absences</h4></c.header>
        <c.block>
          {{#if this.absences.isRunning}}
            <Empty>
              <LoadingIcon />
            </Empty>
          {{else}}
            {{#let this.absences.value as |absences|}}
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
}
