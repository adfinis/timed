import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { LinkTo } from "@ember/routing";
import can from "ember-can/helpers/can";
import { eq, or } from "ember-truth-helpers";
import LoadingIcon from "ui-core/components/loading-icon";

import BalanceDonut from "timed/components/balance-donut";
import NoPermission from "timed/components/no-permission";
import WorktimeBalanceChart from "timed/components/worktime-balance-chart";
import balanceHighlightClass from "timed/helpers/balance-highlight-class";
import formatDuration from "timed/helpers/format-duration";
import luxonFormat from "timed/helpers/luxon-format";
import media from "timed/helpers/media";

<template>
  {{#if (can "read user" @model)}}
    <header class="user-header grid border-b">
      <div class="user-header-info">
        <h1
          class="text-foreground text-center text-5xl md:text-6xl"
        >{{@model.fullName}}</h1>
      </div>

      {{#if @controller.data.isRunning}}
        <div
          class="user-header-loading grid w-full place-items-center place-self-center"
        >
          <LoadingIcon />
        </div>
      {{else}}
        {{#unless @model.activeEmployment.isExternal}}
          <h2
            class="user-header-worktime-balance-title text-foreground-muted text-center text-2xl uppercase md:text-3xl"
          >Worktime balance</h2>

          <div
            class="user-header-worktime-balance-container mb-5 grid w-full max-w-[48rem] grid-cols-2 place-self-center px-8 sm:px-16 md:grid-cols-[minmax(0,0.9fr),minmax(0,2.2fr),minmax(0,0.9fr)] md:px-0 lg:w-3/4 lg:grid-cols-[auto,minmax(0,0.8fr),auto] lg:gap-2 xl:max-w-[52rem]"
          >
            <div
              class="user-header-worktime-balance-last-valid-timesheet w-full self-center justify-self-end text-center max-md:px-2 max-md:text-left md:-translate-y-4"
            >
              {{#let
                @controller.data.lastSuccessful.value.worktimeBalanceLastValidTimesheet
                as |balance|
              }}
                <h2
                  title="Last day with timesheet entries or absences"
                  class="text-foreground-muted text-base uppercase sm:text-lg md:text-xl lg:text-2xl"
                >
                  {{luxonFormat
                    (or balance.date @model.activeEmployment.start)
                    "dd.MM.yyyy"
                  }}
                </h2>
                <div
                  class="{{balanceHighlightClass balance.balance}}
                    text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                >
                  {{formatDuration balance.balance false}}
                </div>
              {{/let}}
            </div>

            {{#if (media "isMd")}}
              <div class="user-header-worktime-balance">
                {{#if @controller.worktimeBalancesData.isRunning}}
                  <div
                    class="flex h-full min-h-[8rem] items-center justify-center"
                  >
                    <LoadingIcon />
                  </div>
                {{else}}
                  <WorktimeBalanceChart
                    @worktimeBalances={{@controller.worktimeBalancesData.value}}
                  />
                {{/if}}
                <div class="mt-1 flex justify-center">
                  <div class="btn-group">
                    {{#each @controller.chartRanges as |range|}}
                      <button
                        type="button"
                        class="btn text-xs
                          {{if
                            (eq @controller.chartRangeDays range.days)
                            'btn-primary'
                            'btn-default'
                          }}"
                        {{on "click" (fn @controller.setChartRange range.days)}}
                      >{{range.label}}</button>
                    {{/each}}
                  </div>
                </div>
              </div>
            {{/if}}

            <div
              class="user-header-worktime-balance-today w-full self-center justify-self-start text-center max-md:px-2 max-md:text-right md:-translate-y-4"
            >
              {{#let
                @controller.data.lastSuccessful.value.worktimeBalanceToday
                as |balance|
              }}
                <h2
                  class="text-foreground-muted text-base uppercase sm:text-lg md:text-xl lg:text-2xl"
                >Today</h2>
                <div
                  class="{{balanceHighlightClass balance.balance}}
                    text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                >
                  {{formatDuration balance.balance false}}
                </div>
              {{/let}}
            </div>

            {{#unless (media "isMd")}}
              <div class="user-header-worktime-balance col-span-2">
                {{#if @controller.worktimeBalancesData.isRunning}}
                  <div
                    class="flex h-full min-h-[8rem] items-center justify-center"
                  >
                    <LoadingIcon />
                  </div>
                {{else}}
                  <WorktimeBalanceChart
                    @worktimeBalances={{@controller.worktimeBalancesData.value}}
                  />
                {{/if}}
                <div class="mt-1 flex justify-center">
                  <div class="btn-group">
                    {{#each @controller.chartRanges as |range|}}
                      <button
                        type="button"
                        class="btn text-xs
                          {{if
                            (eq @controller.chartRangeDays range.days)
                            'btn-primary'
                            'btn-default'
                          }}"
                        {{on "click" (fn @controller.setChartRange range.days)}}
                      >{{range.label}}</button>
                    {{/each}}
                  </div>
                </div>
              </div>
            {{/unless}}
          </div>

          <div
            class="user-header-absence-balance-container mb-2 flex w-full max-w-[48rem] flex-row flex-wrap justify-around place-self-center transition-[padding,max-width] transition-all md:justify-between md:px-8 lg:px-9 xl:max-w-[52rem] xl:px-10"
          >
            {{#let
              @controller.data.lastSuccessful.value.absenceBalances
              as |balances|
            }}
              {{#each balances as |balance index|}}
                <BalanceDonut
                  @balance={{balance}}
                  @class="user-header-absence-balance"
                  @title={{balance.absenceType.name}}
                  @index={{index}}
                  @count={{balances.length}}
                />
              {{/each}}
            {{/let}}
          </div>
        {{/unless}}
      {{/if}}

    </header>

    <nav class="user-navigation border-b shadow-sm">
      <ul
        class="[&>li>a]:text-foreground-muted [&>li>a.active]:text-primary [&>li>a.active]:shadow-primary grid grid-cols-[repeat(3,auto)] justify-center text-xl [&>li>a.active]:shadow-[inset_0_-2px_0] [&>li>a]:block [&>li>a]:px-6 [&>li>a]:py-2"
      >
        <li><LinkTo
            @route="users.edit.index"
            @model={{@model.id}}
          >General</LinkTo></li>
        <li><LinkTo
            @route="users.edit.credits"
            @model={{@model.id}}
          >Credits</LinkTo></li>
        <li><LinkTo
            @route="users.edit.responsibilities"
            @model={{@model.id}}
          >Responsibilities</LinkTo></li>
      </ul>
    </nav>

    <section class="user-content pt-1 md:pt-2 lg:pt-3">
      {{outlet}}
    </section>
  {{else}}
    <NoPermission />
  {{/if}}
</template>
