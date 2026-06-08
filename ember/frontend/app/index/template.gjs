import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import slice from "@nullvoxpopuli/ember-composable-helpers/helpers/slice";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";
import cannot from "ember-can/helpers/cannot";
import changeset from "ember-changeset/helpers/changeset";
import changesetSet from "ember-changeset/helpers/changeset-set";
import perform from "ember-concurrency/helpers/perform";
import PowerCalendar from "ember-power-calendar/components/power-calendar";
import PowerCalendarMultiple from "ember-power-calendar/components/power-calendar-multiple";
import eq from "ember-truth-helpers/helpers/eq";
import or from "ember-truth-helpers/helpers/or";
import ValidatedForm from "ember-validated-form/components/validated-form";

import DateNavigation from "timed/components/date-navigation";
import Modal from "timed/components/modal";
import NavTabs from "timed/components/nav-tabs";
import A from "timed/components/nav-tabs/a";
import Badge from "timed/components/nav-tabs/badge";
import Button from "timed/components/nav-tabs/button";
import Item from "timed/components/nav-tabs/item";
import TrackingBar from "timed/components/tracking-bar";
import WeeklyOverview from "timed/components/weekly-overview";
import WeeklyOverviewDay from "timed/components/weekly-overview-day";
import humanizeDuration from "timed/helpers/humanize-duration";
import luxonFormat from "timed/helpers/luxon-format";
import media from "timed/helpers/media";
<template>
  <TrackingBar data-test-tracking-bar />
  <div class="grid--12of12 grid">
    <div class="grid md:grid-cols-[minmax(0,1fr),auto]">
      <h1 class="block max-md:mb-2">{{luxonFormat
          @model
          "EEEE, dd.MM.yyyy"
        }}</h1>
      <DateNavigation
        @current={{@controller.date}}
        @onChange={{fn (mut @controller.date)}}
      />
    </div>
    <div>
      <WeeklyOverview
        @expected={{@controller.expectedWorktime}}
        data-test-weekly-overview
      >
        {{#each
          (if
            (media "isXl")
            @controller.weeklyOverviewData.value
            (slice
              @controller.weeklyOverviewSliceValue
              (@controller.negate @controller.weeklyOverviewSliceValue)
              @controller.weeklyOverviewData.value
            )
          )
          as |d|
        }}
          <WeeklyOverviewDay
            @day={{d.day}}
            @active={{d.active}}
            @worktime={{d.worktime}}
            @workday={{d.workday}}
            @absence={{d.absence}}
            @holiday={{d.holiday}}
            @prefix={{d.prefix}}
            @onClick={{fn (mut @controller.date)}}
            data-test-weekly-overview-day={{luxonFormat d.day "dd"}}
          />
        {{/each}}
      </WeeklyOverview>
    </div>
    <div class="grid-cell visible-sm grid-rows-1">
      <NavTabs
        class="grid grid-rows-1 max-sm:my-2 sm:grid-cols-[repeat(3,minmax(0,auto)),50fr]"
      >
        <Item>
          <A @route="index.activities">
            Activity
            <Badge>
              {{humanizeDuration @controller.activitySum true}}
            </Badge>
          </A>
        </Item>
        <Item>
          <A @route="index.attendances">
            Attendance
            <Badge>
              {{humanizeDuration @controller.attendanceSum}}
            </Badge>
          </A>
        </Item>
        <Item>
          <A @route="index.reports">
            Timesheet
            <Badge>
              {{humanizeDuration @controller.reportSum}}
            </Badge>
          </A>
        </Item>
        {{#if @controller.absence}}
          <li
            class="border-warning grid border first:rounded-t-sm last:rounded-b-sm sm:hidden"
          >
            <button
              type="button"
              data-test-edit-absence
              class="btn bg-warning hover:bg-warning-accent border-warning text-foreground-primary rounded-none border-none"
              {{on "click" (toggle "showEditModal" @controller)}}
            >
              {{@controller.absence.absenceType.name}}
            </button>
          </li>
        {{/if}}
        <li class="grid rounded-b-sm border first:rounded-t-sm sm:hidden">
          <button
            type="button"
            data-test-add-absence
            class="btn sm:btn-default rounded-none border-none"
            disabled={{cannot "access page"}}
            {{on "click" (toggle "showAddModal" @controller)}}
          >
            Add absence
          </button>
        </li>
        <li
          class="mt-px flex w-full gap-x-1 max-sm:hidden sm:justify-end sm:pt-px md:gap-x-2"
        >
          {{#if @controller.absence}}
            <Button
              type="button"
              data-test-edit-absence
              class="bg-warning-light border-warning hover:bg-warning hover:border-warning-accent text-foreground-primary"
              {{on "click" (toggle "showEditModal" @controller)}}
            >
              {{@controller.absence.absenceType.name}}
            </Button>
          {{/if}}
          <Button
            class="hover:text-primary hover:border-primary whitespace-nowrap"
            data-test-add-absence
            disabled={{cannot "access page"}}
            {{on "click" (toggle "showAddModal" @controller)}}
          >
            Add absence
          </Button>
        </li>
      </NavTabs>
    </div>
  </div>
  {{outlet}}

  {{#if @controller.absence}}
    {{#let
      (changeset @controller.absence @controller.AbsenceValidations)
      as |cs|
    }}
      <Modal
        class="!w-fit md:w-auto"
        @visible={{@controller.showEditModal}}
        @onClose={{queue
          (toggle "showEditModal" @controller)
          (fn @controller.rollback cs)
        }}
        as |modal|
      >
        <div data-test-edit-absence-form>
          <ValidatedForm
            @model={{cs}}
            @on-submit={{fn @controller.saveAbsence cs}}
            as |f|
          >
            <modal.header>
              <h3>Edit absence</h3>
            </modal.header>
            <modal.body class="grid gap-2">
              <f.input @name="absenceType" as |fi|>
                <div class="btn-group grid grid-cols-3" data-test-absence-types>
                  {{#each @controller.absenceTypes as |at|}}
                    <button
                      data-test-absence-type
                      data-test-absence-type-id={{at.id}}
                      type="button"
                      class="btn
                        {{if
                          (eq at.id cs.absenceType.id)
                          'btn-primary'
                          'btn-default'
                        }}"
                      {{on "click" (fn fi.update at)}}
                    >{{at.name}}</button>
                  {{/each}}
                </div>
              </f.input>
              <f.input @name="date">
                <PowerCalendar
                  class="calendar [--size:2.5rem] sm:[--size:2.75rem] md:[--size:3rem] lg:[--size:3.25rem]"
                  @selected={{cs.date}}
                  @center={{or @controller.center @controller.date}}
                  @onCenterChange={{pick
                    "datetime"
                    (perform @controller.setCenter)
                  }}
                  @onSelect={{pick "datetime" (changesetSet cs "date")}}
                  as |calendar|
                >
                  <div class={{if calendar.loading "loading-mask"}}>
                    <calendar.Nav />
                    <calendar.Days
                      @disabledDates={{@controller.disabledDatesForEdit}}
                      @startOfWeek={{1}}
                    />
                  </div>
                </PowerCalendar>
              </f.input>
              {{#if cs.absenceType.allowComments}}
                <f.input
                  data-test-absence-comment
                  class="rounded"
                  @type="textarea"
                  @placeholder="Optional comment..."
                  @name="comment"
                />
              {{/if}}
            </modal.body>
            <modal.footer class="flex justify-between">
              <button
                type="button"
                class="btn btn-danger"
                {{on
                  "click"
                  (fn @controller.deleteAbsence @controller.absence)
                }}
                data-test-edit-absence-delete
              >Delete</button>
              <f.submit @label="Save" data-test-edit-absence-save />
            </modal.footer>
          </ValidatedForm>
        </div>
      </Modal>
    {{/let}}
  {{/if}}

  {{#let
    (changeset @controller.newAbsence @controller.MultipleAbsenceValidations)
    as |cs|
  }}
    {{#let
      (queue (toggle "showAddModal" @controller) (fn @controller.rollback cs))
      as |onClose|
    }}
      <Modal
        class="!w-fit md:w-auto"
        @visible={{@controller.showAddModal}}
        @onClose={{onClose}}
        as |modal|
      >
        <div data-test-add-absence-form>
          <ValidatedForm
            @model={{cs}}
            @on-submit={{fn @controller.addAbsence cs}}
            as |f|
          >
            <modal.header>
              <h3>New absence</h3>
            </modal.header>
            <modal.body class="grid gap-2">
              <f.input @name="absenceType" as |fi|>
                <div class="btn-group grid grid-cols-3" data-test-absence-types>
                  {{#each @controller.absenceTypes as |at|}}
                    <button
                      data-test-absence-type
                      data-test-absence-type-id={{at.id}}
                      type="button"
                      class="btn
                        {{if
                          (eq at.id cs.absenceType.id)
                          'btn-primary'
                          'btn-default'
                        }}"
                      {{on "click" (fn fi.update at)}}
                    >{{at.name}}</button>
                  {{/each}}
                </div>
              </f.input>

              <f.input @name="dates">
                <PowerCalendarMultiple
                  class="calendar [--size:2.5rem] sm:[--size:2.75rem] md:[--size:3rem] lg:[--size:3.25rem]"
                  @selected={{cs.dates}}
                  @center={{@controller.center}}
                  @onCenterChange={{pick
                    "datetime"
                    (perform @controller.setCenter)
                  }}
                  @onSelect={{fn @controller.updateSelection cs "dates"}}
                  as |calendar|
                >
                  <div class={{if calendar.loading "loading-mask"}}>
                    <calendar.Nav />
                    <calendar.Days
                      @disabledDates={{@controller.disabledDates}}
                      @startOfWeek={{1}}
                    />
                  </div>
                </PowerCalendarMultiple>
              </f.input>
              {{#if cs.absenceType.allowComments}}
                <f.input
                  data-test-absence-comment
                  class="rounded"
                  @type="textarea"
                  @placeholder="Optional comment..."
                  @name="comment"
                />
              {{/if}}

            </modal.body>
            <modal.footer class="flex justify-between">
              <button
                type="button"
                class="btn btn-default"
                {{on "click" onClose}}
                data-test-edit-absence-cancel
              >Cancel</button>
              <f.submit @label="Save" data-test-add-absence-save />
            </modal.footer>
          </ValidatedForm>
        </div>
      </Modal>
    {{/let}}
  {{/let}}
</template>
