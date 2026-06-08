import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import changeset from "ember-changeset/helpers/changeset";
import perform from "ember-concurrency/helpers/perform";
import PowerSelect from "ember-power-select/components/power-select";
import { and, eq, not } from "ember-truth-helpers";
import ValidatedForm from "ember-validated-form/components/validated-form";

import Checkbox from "timed/components/checkbox";
import Checkmark from "timed/components/checkmark";
import Durationpicker from "timed/components/durationpicker";
import Empty from "timed/components/empty";
import LoadingIcon from "timed/components/loading-icon";
import CustomerOption from "timed/components/optimized-power-select/custom-options/customer-option";
import ProjectOption from "timed/components/optimized-power-select/custom-options/project-option";
import PagePermission from "timed/components/page-permission";
import ScrollContainer from "timed/components/scroll-container";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Th from "timed/components/table/th";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import humanizeDuration from "timed/helpers/humanize-duration";

<template>
  <PagePermission>
    <h1 class="mb-2">Projects</h1>
    {{#if @controller.loading}}
      <Empty>
        <LoadingIcon />
      </Empty>
    {{else}}
      <div class="mb-2 grid gap-2 pb-2 sm:grid-cols-2">
        <PowerSelect
          data-test-customer-selection
          class="rounded [&_.ember-power-select-selected-item_svg]:!hidden"
          @tagName="div"
          @options={{@controller.customers}}
          @placeholder="Select customer..."
          @searchEnabled={{true}}
          @searchField="name"
          @onChange={{@controller.handleCustomerChange}}
          @selected={{@controller.selectedCustomer}}
          @allowClear={{true}}
          as |customer|
        >
          <CustomerOption @option={{customer}} />
        </PowerSelect>
        <PowerSelect
          data-test-project-selection
          class="rounded [&_.ember-power-select-selected-item_svg]:!hidden"
          @tagName="div"
          @options={{@controller.filteredProjects}}
          @placeholder="Select project..."
          @searchEnabled={{true}}
          @searchField="name"
          @onChange={{@controller.handleProjectChange}}
          @selected={{@controller.selectedProject}}
          @allowClear={{true}}
          @disabled={{not @controller.selectedCustomer}}
          as |project|
        >
          <ProjectOption @option={{project}} />
        </PowerSelect>
      </div>
      {{#if @controller.selectedProject}}
        {{#let
          @controller.selectedProject.remainingEffortTracking
          as |remainingEffortTracking|
        }}
          <h2 class="text-primary mb-2">
            {{@controller.selectedProject.name}}
          </h2>
          <ValidatedForm
            @model={{changeset
              @controller.selectedProject
              @controller.projectValidations
            }}
            @on-submit={{perform @controller.saveProject}}
            as |f|
          >
            <f.input @name="remainingEffortTracking" as |fi|>
              <Checkbox
                data-test-remaining-effort-tracking
                @checked={{remainingEffortTracking}}
                @value={{fi.value}}
                @onChange={{fi.update}}
              >Remaining Effort Tracking</Checkbox>
            </f.input>
            {{#if
              (and
                remainingEffortTracking
                @controller.selectedProject.totalRemainingEffort
              )
            }}
              Total remaining effort:
              {{humanizeDuration
                @controller.selectedProject.totalRemainingEffort
              }}
            {{/if}}

            <div class="grid place-items-end">
              {{#each f.model.errors as |error|}}
                <div class="text-warning" title={{error.validation}}>
                  <FaIcon @icon="exclamation-triangle" @prefix="fas" />
                </div>
              {{/each}}

              <f.submit
                data-test-project-save
                @disabled={{f.model.isInvalid}}
                @triggerValidations={{true}}
              >Update
              </f.submit>
            </div>
          </ValidatedForm>

          <hr class="my-2" />
          <div class="flex justify-between">
            <h3 class="text-primary">
              Tasks
            </h3>
            <span class="header-right">
              <button
                class="btn btn-primary"
                data-test-add-task
                type="button"
                {{on "click" (perform @controller.createTask)}}
              >Add Task</button>
            </span>
          </div>
          <Checkbox
            data-test-show-archived
            @checked={{@controller.hideArchivedTasks}}
            @value={{@controller.hideArchivedTasks}}
            @onChange={{fn (mut @controller.hideArchivedTasks)}}
          >Hide Archived Tasks</Checkbox>
          <Table class="table-fixed">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Reference</Th>
                <Th>Estimated time</Th>
                {{#if remainingEffortTracking}}
                  <Th>Remaining effort</Th>
                {{/if}}
                <Th>Archived</Th>
              </Tr>
            </Thead>
          </Table>
          <ScrollContainer class="mb-2 border-b-2">
            <Table
              class="table--striped table--projects table table-fixed"
              data-test-tasks-table
            >
              <colgroup>
                <col class="title" />
                <col class="reference" />
                <col class="duration" />
                {{#if remainingEffortTracking}}
                  <col class="duration" />
                {{/if}}
                <col class="archived" />
              </colgroup>
              <tbody>
                {{#each @controller.tasks as |task|}}
                  {{#unless (and @controller.hideArchivedTasks task.archived)}}
                    <Tr
                      @striped={{not (eq @controller.selectedTask task)}}
                      class="cursor-pointer
                        {{if
                          (eq @controller.selectedTask task)
                          'bg-primary text-foreground-primary'
                          'hover:bg-background-secondary/25'
                        }}
                        "
                      {{! template-lint-disable }}
                      {{on "click" (fn (mut @controller.selectedTask) task)}}
                      data-test-task-table-row
                    >
                      <Td data-test-table-name>{{task.name}}</Td>
                      <Td data-test-table-reference>{{if
                          task.reference
                          task.reference
                          "-"
                        }}</Td>
                      <Td data-test-table-estimated-time>{{if
                          task.estimatedTime
                          (humanizeDuration task.estimatedTime)
                          "-"
                        }}</Td>

                      {{#if remainingEffortTracking}}
                        <Td data-test-table-most-recent-remaining-effort>{{if
                            task.mostRecentRemainingEffort
                            (humanizeDuration task.mostRecentRemainingEffort)
                            "-"
                          }}</Td>
                      {{/if}}
                      <Td><Checkmark
                          data-test-table-archived
                          @checked={{task.archived}}
                        /></Td>
                    </Tr>
                  {{/unless}}
                {{/each}}
              </tbody>
            </Table>
          </ScrollContainer>
          {{#if @controller.selectedTask}}
            <div class="task-form-container" data-test-task-form>
              <h3 class="text-primary">{{if
                  @controller.selectedTask.isNew
                  "Add task"
                  @controller.selectedTask.name
                }}</h3>
              <ValidatedForm
                class="grid grid-cols-2 gap-2"
                @model={{changeset
                  @controller.selectedTask
                  @controller.taskValidations
                }}
                @on-submit={{perform @controller.saveTask}}
                as |f|
              >
                <f.input
                  @label="Name"
                  @name="name"
                  class="rounded"
                  data-test-name
                  @required={{true}}
                />

                <f.input @labelComponent="void" @name="estimatedTime" as |fi|>
                  <div class="form-group">
                    <label>
                      Estimated time
                    </label>
                    <Durationpicker
                      data-test-estimated-time={{true}}
                      @value={{fi.value}}
                      @onChange={{if
                        remainingEffortTracking
                        (queue
                          fi.update
                          (fn @controller.updateRemainingEffort f.model)
                        )
                        fi.update
                      }}
                    />
                  </div>
                </f.input>

                <f.input
                  @label="Reference"
                  @name="reference"
                  class="rounded"
                  data-test-reference
                  @required={{false}}
                />

                {{#if remainingEffortTracking}}
                  <f.input
                    @name="mostRecentRemainingEffort"
                    @labelComponent="void"
                    as |fi|
                  >
                    <div class="form-group">
                      <label>
                        Remaining effort
                      </label>
                      <Durationpicker
                        class="remaining-effort"
                        data-test-remaining-effort={{true}}
                        @value={{fi.value}}
                        @min={{0}}
                        @onChange={{fi.update}}
                      />
                    </div>
                  </f.input>
                {{/if}}

                <f.input @name="archived" @labelComponent="void" as |fi|>
                  <Checkbox
                    class="justify-content-start flex flex-col-reverse [&>input]:my-auto"
                    @label="Archived"
                    data-test-archived
                    @checked={{@controller.selectedTask.archived}}
                    @value={{fi.value}}
                    @onChange={{fi.update}}
                  />
                </f.input>

                <div class="col-span-2 flex justify-between">
                  <button
                    class="btn btn-default"
                    data-test-cancel
                    type="button"
                    {{on "click" (fn (mut @controller.selectedTask) null)}}
                  >Cancel</button>
                  <f.submit data-test-save @disabled={{f.model.isInvalid}} />
                </div>
              </ValidatedForm>
            </div>
          {{/if}}
        {{/let}}
      {{else}}
        <Empty data-test-none-selected>
          <FaIcon @icon="magnifying-glass" @prefix="fas" />
          <h3>Please select a customer and a project</h3>
        </Empty>
      {{/if}}
    {{/if}}
  </PagePermission>
</template>
