import { fn, hash } from "@ember/helper";
import { on } from "@ember/modifier";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import changeset from "ember-changeset/helpers/changeset";
import perform from "ember-concurrency/helpers/perform";
import { and, eq, not, notEq, or } from "ember-truth-helpers";
import ValidatedForm from "ember-validated-form/components/validated-form";
import Card from "ui-core/components/ui-card";

import ChangedWarning from "timed/components/changed-warning";
import Checkbox from "timed/components/checkbox";
import Empty from "timed/components/empty";
import LoadingIcon from "timed/components/loading-icon";
import NotIdenticalWarning from "timed/components/not-identical-warning";
import PagePermission from "timed/components/page-permission";
import ReportComment from "timed/components/report-comment";
import TaskSelection from "timed/components/task-selection";
import Void from "timed/components/void";

<template>
  <PagePermission>
    <div class="grid md:grid-cols-4">
      <div class="grid-cell"></div>
      <div class="grid-cell col-span-2">
        {{#if @controller.intersection.isRunning}}
          <Empty>
            <LoadingIcon />
          </Empty>
        {{else}}
          {{#let
            @controller.intersection.lastSuccessful.value.model
            as |model|
          }}
            {{#let
              (changeset model @controller.IntersectionValidations)
              as |cs|
            }}
              <ValidatedForm
                @model={{cs}}
                @on-submit={{perform @controller.save}}
                as |f|
              >
                <Card as |c|>
                  <c.header>
                    <h1 class="text-foreground text-center">
                      {{#if
                        (eq
                          @controller.intersection.lastSuccessful.value.meta.count
                          1
                        )
                      }}
                        Edit report
                      {{else}}
                        Bulk edit
                        {{@controller.intersection.lastSuccessful.value.meta.count}}
                        reports
                      {{/if}}
                    </h1>
                  </c.header>

                  <TaskSelection
                    @on-set-customer={{queue
                      (fn (mut f.model.customer))
                      (fn @controller.validate f.model)
                    }}
                    @on-set-project={{queue
                      (fn (mut f.model.project))
                      (fn @controller.validate f.model)
                    }}
                    @on-set-task={{queue
                      (fn (mut f.model.task))
                      (fn @controller.validate f.model)
                    }}
                    @initial={{hash
                      customer=@controller._customer
                      project=@controller._project
                      task=@controller._task
                    }}
                    as |t|
                  >
                    <c.block class="grid gap-2">
                      <f.input @labelComponent={{Void}} @name="task">
                        <div class="form-group" data-test-customer>
                          <label>
                            Customer
                            {{#unless model.customer}}
                              <NotIdenticalWarning />
                            {{/unless}}
                            {{#if
                              (and
                                f.model.change.customer.id
                                (not
                                  (eq
                                    f.model.change.customer.id model.customer.id
                                  )
                                )
                              )
                            }}
                              <ChangedWarning />
                            {{/if}}
                          </label>
                          <t.customer />
                        </div>
                        <div class="form-group" data-test-project>
                          <label>
                            Project
                            {{#unless model.project}}
                              <NotIdenticalWarning />
                            {{/unless}}
                            {{#if
                              (and
                                f.model.change.project.id
                                (not
                                  (eq
                                    f.model.change.project.id model.project.id
                                  )
                                )
                              )
                            }}
                              <ChangedWarning />
                            {{/if}}
                          </label>
                          <t.project />
                        </div>
                        <div class="form-group" data-test-task>
                          <label>
                            Task
                            {{#unless model.task}}
                              <NotIdenticalWarning />
                            {{/unless}}
                            {{#if
                              (and
                                f.model.change.task.id
                                (not (eq f.model.change.task.id model.task.id))
                              )
                            }}
                              <ChangedWarning />
                            {{/if}}
                          </label>
                          <t.task />
                        </div>
                      </f.input>

                      <f.input @name="comment" as |fi|>
                        <label for="comment">
                          Comment
                          {{#if (eq model.comment null)}}
                            <NotIdenticalWarning />
                          {{/if}}
                          {{#if (notEq f.model.comment model.comment)}}
                            <ChangedWarning />
                          {{/if}}
                          <ReportComment
                            @value={{fi.value}}
                            @customerVisible={{model.task.project.customerVisible}}
                            @onChange={{fi.update}}
                            @onSubmit={{f.submitAction}}
                          />
                        </label>
                      </f.input>

                      <div class="grid gap-1">
                        <f.input
                          @name="notBillable"
                          @labelComponent={{Void}}
                          as |fi|
                        >
                          <Checkbox
                            data-test-not-billable
                            @checked={{fi.value}}
                            @onChange={{fi.update}}
                          >
                            Not billable
                            {{#if (eq model.notBillable null)}}
                              <NotIdenticalWarning />
                            {{/if}}
                            {{#if
                              (notEq f.model.notBillable model.notBillable)
                            }}
                              <ChangedWarning />
                            {{/if}}
                          </Checkbox>
                        </f.input>

                        <f.input
                          @name="review"
                          @labelComponent={{Void}}
                          as |fi|
                        >
                          <Checkbox
                            data-test-review
                            @checked={{fi.value}}
                            @onChange={{fi.update}}
                          >
                            Needs Review
                            {{#if (eq model.review null)}}
                              <NotIdenticalWarning />
                            {{/if}}
                            {{#if (notEq f.model.review model.review)}}
                              <ChangedWarning />
                            {{/if}}
                          </Checkbox>
                        </f.input>

                        <f.input
                          @name="rejected"
                          @labelComponent={{Void}}
                          as |fi|
                        >
                          <Checkbox
                            data-test-rejected
                            @checked={{fi.value}}
                            @onChange={{fi.update}}
                            @disabled={{or
                              (and
                                (not @controller.isReviewer)
                                (not @controller.isSuperuser)
                              )
                              @controller.hasSelectedOwnReports
                            }}
                          >
                            Reject report
                            {{#if (eq model.rejected null)}}
                              <NotIdenticalWarning />
                            {{/if}}
                            {{#if (notEq f.model.rejected model.rejected)}}
                              <ChangedWarning />
                            {{/if}}
                          </Checkbox>
                        </f.input>

                        <f.input
                          @name="billed"
                          @labelComponent={{Void}}
                          as |fi|
                        >
                          <Checkbox
                            data-test-billed
                            @checked={{fi.value}}
                            @onChange={{fi.update}}
                            @title={{not
                              @controller.canBill
                              "You do not have appropriate roles for this action."
                            }}
                            @disabled={{not @controller.canBill}}
                          >
                            Billed
                            {{#if (eq model.billed null)}}
                              <NotIdenticalWarning />
                            {{/if}}
                            {{#if (notEq f.model.billed model.billed)}}
                              <ChangedWarning />
                            {{/if}}
                          </Checkbox>
                        </f.input>

                        <f.input
                          @name="verified"
                          @labelComponent={{Void}}
                          @dirty={{true}}
                          as |fi|
                        >
                          <Checkbox
                            data-test-verified
                            @checked={{fi.value}}
                            @onChange={{fi.update}}
                            @title={{@controller.toolTipText}}
                            @disabled={{or
                              (not @controller.canVerify)
                              @controller.needsReview
                            }}
                          >
                            Verified
                            {{#if (eq model.verified null)}}
                              <NotIdenticalWarning />
                            {{/if}}
                            {{#if (notEq f.model.verified model.verified)}}
                              <ChangedWarning />
                            {{/if}}
                          </Checkbox>
                        </f.input>
                      </div>

                      <f.input @name="reviewComment" @dirty={{true}} as |fi|>
                        <label
                          for="review-comment"
                          data-test-review-comment-label
                        >
                          Review Comment
                          <input
                            data-test-review-comment
                            id="review-comment"
                            type="text"
                            placeholder="Comment/Reason for change/rejection..."
                            class="form-control comment-field rounded"
                            {{on "change" (pick "target.value" fi.update)}}
                            value={{fi.value}}
                          />
                        </label>
                      </f.input>

                    </c.block>
                    <c.footer class="flex justify-between">
                      <div class="flex gap-2">
                        <button
                          data-test-cancel
                          type="button"
                          class="btn btn-default"
                          {{on "click" @controller.cancel}}
                        >Cancel</button>
                        <button
                          data-test-reset
                          type="button"
                          class="btn btn-default"
                          {{on
                            "click"
                            (queue
                              t.reset (fn @controller.resetChangeset f.model)
                            )
                          }}
                        >Reset</button>
                      </div>
                      <f.submit />
                    </c.footer>
                  </TaskSelection>
                </Card>
              </ValidatedForm>
            {{/let}}
          {{/let}}
        {{/if}}
      </div>
      <div class="grid-cell"></div>
    </div>
  </PagePermission>
</template>
