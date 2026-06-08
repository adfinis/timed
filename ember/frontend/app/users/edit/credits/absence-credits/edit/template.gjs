import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { LinkTo } from "@ember/routing";
import can from "ember-can/helpers/can";
import changeset from "ember-changeset/helpers/changeset";
import perform from "ember-concurrency/helpers/perform";
import and from "ember-truth-helpers/helpers/and";
import eq from "ember-truth-helpers/helpers/eq";
import not from "ember-truth-helpers/helpers/not";
import or from "ember-truth-helpers/helpers/or";
import ValidatedForm from "ember-validated-form/components/validated-form";

import Card from "timed/components/card";
import Datepicker from "timed/components/datepicker";
import NoPermission from "timed/components/no-permission";
<template>
  {{#let @controller.credit.lastSuccessful.value as |credit|}}
    {{#if
      (or
        (and credit.isNew (can "create absence-credit"))
        (and (not credit.isNew) (can "edit absence-credit"))
      )
    }}
      <div class="grid md:grid-cols-3">
        <div class="grid-cell"></div>
        <ValidatedForm
          @model={{changeset credit @controller.AbsenceCreditValidations}}
          @on-submit={{perform @controller.save}}
          as |f|
        >

          <Card as |c|>
            <c.header><h4 class="text-center">{{if credit.isNew "New" "Edit"}}
                absence credit</h4></c.header>
            <c.block class="grid gap-2">
              <f.input @label="Type" @name="absenceType" as |fi|>
                <div class="btn-group [&>*]:w-full">
                  {{#each
                    @controller.absenceTypes.lastSuccessful.value
                    as |type|
                  }}
                    <button
                      class="btn
                        {{if
                          (eq fi.value.id type.id)
                          'btn-primary'
                          'btn-default'
                        }}"
                      type="button"
                      {{on "click" (fn fi.update type)}}
                    >{{type.name}}</button>
                  {{/each}}
                </div>
              </f.input>
              <div>
                <f.input @label="Date" @name="date" as |fi|>
                  <Datepicker @value={{fi.value}} @onChange={{fi.update}} />
                </f.input>
              </div>
              <f.input
                class="rounded"
                @type="number"
                @label="Days"
                @name="days"
              />
              <f.input
                class="rounded"
                @type="text"
                @label="Comment"
                @name="comment"
              />

            </c.block>
            <c.footer class="flex justify-between">
              <LinkTo
                @route="users.edit.credits.index"
                @model={{@controller.user.id}}
                class="btn btn-default"
              >Cancel</LinkTo>
              <div class="flex gap-2">
                {{#unless credit.isNew}}
                  <button
                    type="button"
                    data-test-absence-credit-delete
                    class="btn btn-danger
                      {{if @controller.delete.isRunning 'loading'}}"
                    {{on "click" (perform @controller.delete credit)}}
                  >Delete</button>
                {{/unless}}
                <f.submit
                  data-test-absence-credit-save
                  @disabled={{f.model.isInvalid}}
                />
              </div>
            </c.footer>
          </Card>
        </ValidatedForm>
        <div class="grid-cell"></div>
      </div>
    {{else}}
      <div class="grid">
        <div class="grid-cell">
          <NoPermission />
        </div>
      </div>
    {{/if}}
  {{/let}}
</template>
