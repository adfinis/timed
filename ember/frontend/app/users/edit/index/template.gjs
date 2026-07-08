import { service } from "@ember/service";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import { DateTime } from "luxon";
import { trackedTask } from "reactiveweb/ember-concurrency";
import LoadingIcon from "ui-core/components/loading-icon";
import Card from "ui-core/components/ui-card";
import Table from "ui-core/components/ui-table";
import { dateToString } from "ui-core/utils/date";

import Empty from "timed/components/empty";
import humanizeDuration from "timed/helpers/humanize-duration";

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
          <Table class="user-general-info" as |t|>
            <t.tbody class="[&>tr>td:last-child]:text-right [&>tr>td]:py-1">
              <t.tr>
                <t.td>Email:</t.td>
                <t.td>{{@model.email}}</t.td>
              </t.tr>
              <t.tr>
                <t.td>Username:</t.td>
                <t.td>{{@model.username}}</t.td>
              </t.tr>
              {{#if @model.activeEmployment}}
                <t.tr>
                  <t.td>Location:</t.td>
                  <t.td>{{@model.activeEmployment.location.name}}</t.td>
                </t.tr>
                <t.tr>
                  <t.td>Contract type:</t.td>
                  <t.td>{{if
                      @model.activeEmployment.isExternal
                      "External"
                      "Internal"
                    }}</t.td>
                </t.tr>
                <t.tr>
                  <t.td>Percentage:</t.td>
                  <t.td>{{@model.activeEmployment.percentage}}%</t.td>
                </t.tr>
                <t.tr>
                  <t.td>Worktime:</t.td>
                  <t.td>{{humanizeDuration
                      @model.activeEmployment.worktimePerDay
                      false
                    }}</t.td>
                </t.tr>
              {{/if}}
            </t.tbody>
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
                <Table @striped={{true}} @last={{true}} @hover={{true}} as |t|>
                  <t.thead>
                    <t.trh>
                      <t.th>Location</t.th>
                      <t.th>Percentage</t.th>
                      <t.th>Start</t.th>
                      <t.th>End</t.th>
                    </t.trh>
                  </t.thead>
                  <tbody>
                    {{#each employments as |employment|}}
                      <t.tr>
                        <t.td>{{employment.location.name}}</t.td>
                        <t.td>{{employment.percentage}}%</t.td>
                        <t.td>{{dateToString employment.start}}</t.td>
                        <t.td>{{if
                            employment.end
                            (dateToString employment.end)
                            "-"
                          }}</t.td>
                      </t.tr>
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
                <Table @striped={{true}} @last={{true}} as |t|>
                  <t.thead>
                    <t.trh class="text-left [&>*]:p-2">
                      <t.th>Type</t.th>
                      <t.th>Date</t.th>
                      <t.th>Comment</t.th>
                    </t.trh>
                  </t.thead>
                  <tbody>
                    {{#each absences as |absence|}}
                      <t.tr>
                        <t.td>{{absence.absenceType.name}}</t.td>
                        <t.td>{{dateToString absence.date}}</t.td>
                        <t.td>{{absence.comment}}</t.td>
                      </t.tr>
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
