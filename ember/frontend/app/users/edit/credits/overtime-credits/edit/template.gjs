import { on } from "@ember/modifier";
import { LinkTo } from "@ember/routing";
import can from "ember-can/helpers/can";
import changeset from "ember-changeset/helpers/changeset";
import perform from "ember-concurrency/helpers/perform";
import { and, not, or } from "ember-truth-helpers";
import ValidatedForm from "ember-validated-form/components/validated-form";
import { Duration } from "luxon";
import Card from "ui-core/components/ui-card";
import Durationpicker from "ui-core/components/ui-durationpicker";

import Datepicker from "timed/components/datepicker";
import NoPermission from "timed/components/no-permission";

const MIN_CREDIT = Duration.fromObject({ minutes: 15 });
const MAX_CREDIT = Duration.fromObject({ hours: 1000 });

const UsersEditCreditsOvertimeCreditsEditTemplate = <template>
  {{#let @controller.credit.lastSuccessful.value as |credit|}}
    {{#if
      (or
        (and credit.isNew (can "create overtime-credit"))
        (and (not credit.isNew) (can "edit overtime-credit"))
      )
    }}
      <div class="grid md:grid-cols-3">
        <div class="grid-cell"></div>
        <div class="grid-cell">
          <ValidatedForm
            @model={{changeset credit @controller.OvertimeCreditValidations}}
            @on-submit={{perform @controller.save}}
            as |f|
          >
            <Card as |c|>
              <c.header>
                <h3 class="text-center">{{if credit.isNew "New" "Edit"}}
                  overtime credit</h3>
              </c.header>
              <c.block class="grid gap-2">
                <div>
                  <f.input @label="Date" @name="date" as |fi|>
                    <Datepicker @value={{fi.value}} @onChange={{fi.update}} />
                  </f.input>
                </div>
                <div>
                  <f.input @label="Duration" @name="duration" as |fi|>
                    <Durationpicker
                      name="duration"
                      @min={{MIN_CREDIT}}
                      @max={{MAX_CREDIT}}
                      @value={{fi.value}}
                      @onChange={{fi.update}}
                    />
                  </f.input>
                </div>
                <f.input
                  class="rounded"
                  @type="text"
                  @label="Comment"
                  @name="comment"
                  @placeholder="Comment"
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
                      class="btn btn-danger
                        {{if @controller.delete.isRunning 'loading'}}"
                      {{on "click" (perform @controller.delete credit)}}
                      data-test-overtime-credit-delete
                    >Delete</button>
                  {{/unless}}
                  <f.submit
                    data-test-overtime-credit-save
                    @disabled={{f.model.isInvalid}}
                  />
                </div>
              </c.footer>
            </Card>
          </ValidatedForm>
        </div>
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
</template>;

export { MIN_CREDIT as OVERTIME_MIN_CREDIT, MAX_CREDIT as OVERTIME_MAX_CREDIT };
export default UsersEditCreditsOvertimeCreditsEditTemplate;
