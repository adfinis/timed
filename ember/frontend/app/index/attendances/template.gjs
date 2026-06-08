import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import changeset from "ember-changeset/helpers/changeset";
import { and, not } from "ember-truth-helpers";

import AttendanceSlider from "timed/components/attendance-slider";
import LowerButton from "timed/components/nav-tabs/lower-button";
import Timepicker from "timed/components/timepicker";
<template>
  <LowerButton
    id="add-attendance"
    data-test-add-attendance
    @onClick={{@controller.addAttendance}}
  >Add attendance
  </LowerButton>

  <div class="attendances grid gap-6">
    {{#if @controller.attendances}}
      <div class="max-sm:hidden">
        {{#each @controller.attendances as |attendance|}}
          <AttendanceSlider
            data-test-attendance-slider
            data-test-attendance-slider-desktop
            data-test-attendance-slider-id={{attendance.id}}
            @attendance={{changeset attendance @controller.AttendanceValidator}}
            @onSave={{queue
              @controller.validateChangeset
              @controller.saveAttendance
            }}
            @onDelete={{@controller.deleteAttendance}}
          />
        {{/each}}
      </div>

      <div class="sm:hidden">
        {{#each @controller.attendances as |attendance|}}
          {{#let
            (changeset attendance @controller.AttendanceValidator)
            as |model|
          }}
            <div
              class="striped border-border/50 grid grid-cols-[repeat(2,minmax(0,1fr)),auto] gap-1 border-t p-1 last:border-b"
              data-test-attendance-slider
              data-test-attendance-slider-mobile
              data-test-attendance-slider-id={{attendance.id}}
            >
              <Timepicker
                class="{{if model.error.from 'has-error'}}"
                @value={{model.from}}
                @onChange={{fn (mut model.from)}}
                @max={{model.to}}
                @onFocusOut={{fn @controller.validateChangeset model}}
              />
              <Timepicker
                class="{{if model.error.to 'has-error'}}"
                @value={{model.to}}
                @onChange={{fn (mut model.to)}}
                @min={{model.from}}
                @onFocusOut={{fn @controller.validateChangeset model}}
              />
              <div class="flex gap-1">
                <button
                  type="button"
                  class="btn btn-danger"
                  {{on "click" (fn @controller.deleteAttendance model)}}
                ><FaIcon @icon="trash-can" /></button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  disabled={{not (and model.isDirty model.isValid)}}
                  {{on "click" (fn @controller.saveAttendance model)}}
                ><FaIcon @icon="floppy-disk" /></button>
              </div>
            </div>
          {{/let}}
        {{/each}}
      </div>
    {{else}}
      <div class="text-center"><em>No attendances yet</em></div>
    {{/if}}
  </div>
</template>
