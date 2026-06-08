import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";
import preventDefault from "ember-event-helpers/helpers/prevent-default";
import PowerCalendar from "ember-power-calendar/components/power-calendar";

import Modal from "timed/components/modal";
import LowerButton from "timed/components/nav-tabs/lower-button";
import ReportRow from "timed/components/report-row";
<template>
  <LowerButton
    title="Move all entries to another date"
    id="reschedule"
    data-test-report-reschedule
    @onClick={{fn (mut @controller.showReschedule) true}}
  >Reschedule
  </LowerButton>

  <div class="reports">
    {{#each @controller.reports as |report|}}
      <ReportRow
        class="striped border-t last:border-b"
        @report={{report}}
        @onSave={{@controller.saveReport}}
        @onDelete={{@controller.deleteReport}}
        data-test-report-row-id={{report.id}}
        data-test-report-row
      />
    {{/each}}
  </div>

  <Modal
    @visible={{@controller.showReschedule}}
    @onClose={{toggle "showReschedule" @controller}}
    class="!w-fit md:w-96"
    as |modal|
  >
    <modal.header>
      <h3>Reschedule timesheet</h3>
    </modal.header>
    <modal.body>
      <PowerCalendar
        class="calendar [--size:2.5rem] sm:[--size:2.75rem] md:[--size:3rem] lg:[--size:3.25rem]"
        @center={{@controller.center}}
        @selected={{@controller.rescheduleDate}}
        @onCenterChange={{pick "datetime" (fn (mut @controller.center))}}
        @onSelect={{pick "datetime" (fn (mut @controller.rescheduleDate))}}
        as |calendar|
      >
        <div class={{if calendar.loading "loading-mask"}}>
          {{calendar.Nav}}
          <calendar.Days
            @disabledDates={{@controller.disabledDates}}
            @startOfWeek={{1}}
          />
        </div>
      </PowerCalendar>
    </modal.body>
    <modal.footer class="flex justify-between">
      <button
        type="reset"
        class="btn btn-default"
        data-test-reschedule-cancel
        {{on "click" (toggle "showReschedule" @controller)}}
      >Cancel</button>
      <button
        type="submit"
        class="btn btn-primary"
        data-test-report-save
        {{on
          "click"
          (preventDefault
            (fn @controller.reschedule @controller.rescheduleDate)
          )
        }}
      >Save</button>
    </modal.footer>
  </Modal>
</template>
