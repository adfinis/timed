import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { task } from "ember-concurrency";
import awaitHelper from "ember-promise-helpers/helpers/await";
import { DateTime } from "luxon";
import { trackedTask } from "reactiveweb/ember-concurrency";
import LoadingIcon from "ui-core/components/loading-icon";
import Card from "ui-core/components/ui-card";
import Table from "ui-core/components/ui-table";

import Empty from "timed/components/empty";
import balanceHighlightClass from "timed/helpers/balance-highlight-class";
import formatDuration from "timed/helpers/format-duration";

export default class UsersEditResponsibilitiesTemplate extends Component {
  @service router;
  @service store;

  @action
  openSupervisorProfile(superviseId) {
    return this.router.transitionTo("users.edit", superviseId);
  }

  projectsTask = task(async (user) => {
    return await this.store.query("project", {
      has_reviewer: user?.id,
      include: "customer",
      ordering: "customer__name,name",
      archived: 0,
    });
  });

  async getBalance(supervisee) {
    return (await supervisee.absenceBalances)[0].balance;
  }

  superviseesTask = task(async (user) => {
    const supervisor = user?.id;

    const balances = await this.store.query("worktime-balance", {
      supervisor,
      date: DateTime.now().toISODate(),
      include: "user",
    });

    return await Promise.all(
      balances
        .map((b) => b.user)
        .filter((u) => u.get("isActive"))
        .map(async (user) => {
          const absenceBalances = await this.store.query("absence-balance", {
            date: DateTime.now().toISODate(),
            user: user.get("id"),
            absence_type: 2,
          });

          user.set("absenceBalances", absenceBalances);

          return user;
        }),
    );
  });

  projects = trackedTask(this, this.projectsTask, () => [this.args.model]);
  supervisees = trackedTask(this, this.superviseesTask, () => [
    this.args.model,
  ]);

  <template>
    <div class="grid gap-2 md:grid-cols-2">

      <Card class="grid grid-rows-[min-content,1fr,min-content]" as |c|>
        <c.header><h4>Projects</h4></c.header>
        <c.block>
          {{#if this.projects.isRunning}}
            <Empty>
              <LoadingIcon />
            </Empty>
          {{else}}
            {{#let this.projects.value as |projects|}}
              {{#if projects}}
                <Table @striped={{true}} @last={{true}} as |t|>
                  <t.thead>
                    <t.trh>
                      <t.th>Customer</t.th>
                      <t.th>Project</t.th>
                    </t.trh>
                  </t.thead>
                  <tbody>
                    {{#each projects as |project|}}
                      <t.tr @striped={{true}} @last={{true}}>
                        <t.td>{{project.customer.name}}</t.td>
                        <t.td>{{project.name}}</t.td>
                      </t.tr>
                    {{/each}}
                  </tbody>
                </Table>
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
          {{#if this.supervisees.isRunning}}
            <Empty>
              <LoadingIcon />
            </Empty>
          {{else}}
            {{#let this.supervisees.value as |supervisees|}}
              {{#if supervisees}}
                <Table
                  class="table--striped table"
                  @striped={{true}}
                  @last={{true}}
                  @hover={{true}}
                  as |t|
                >
                  <t.thead>
                    <t.trh>
                      <t.th>Name</t.th>
                      <t.th>Current worktime balance</t.th>
                      <t.th>Remaining vacation days</t.th>
                    </t.trh>
                  </t.thead>
                  <tbody>
                    {{#each supervisees as |supervisee|}}
                      <t.tr
                        role="link"
                        {{on
                          "click"
                          (fn this.openSupervisorProfile supervisee.id)
                        }}
                      >
                        <t.td>{{supervisee.fullName}}</t.td>
                        <t.td>
                          <span
                            class="worktime-balance
                              {{balanceHighlightClass
                                supervisee.currentWorktimeBalance.balance
                              }}"
                          >
                            {{formatDuration
                              supervisee.currentWorktimeBalance.balance
                              false
                            }}
                          </span>
                        </t.td>

                        {{!
                      absenceBalances has to be an array but will always only
                      contain one element. This is why we get the first object here.
                    }}
                        <t.td>{{awaitHelper
                            (this.getBalance supervisee)
                          }}</t.td>
                      </t.tr>
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
    </div>
  </template>
}
