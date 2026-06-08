import PagePermission from "timed/components/page-permission";
import TaskSelection from "timed/components/task-selection";
import { fn, hash, array } from "@ember/helper";
import FilterSidebar from "timed/components/filter-sidebar";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import UserSelection from "timed/components/user-selection";
import DateButtons from "timed/components/date-buttons";
import NavTabs from "timed/components/nav-tabs";
import Item from "timed/components/nav-tabs/item";
import A from "timed/components/nav-tabs/a";
import eq from "ember-truth-helpers/helpers/eq";
import { on } from "@ember/modifier";
import NoMobileMessage from "timed/components/no-mobile-message";
import not from "ember-truth-helpers/helpers/not";
import includes from "@nullvoxpopuli/ember-composable-helpers/helpers/includes";
import StatisticList from "timed/components/statistic-list";
<template><PagePermission>
  <h1 class="mb-6">Statistics</h1>

  {{#unless @controller.prefetchData.isRunning}}
    <TaskSelection @history={{false}} @archived={{true}} @on-set-customer={{fn @controller.setModelFilter "customer"}} @on-set-project={{fn @controller.setModelFilter "project"}} @on-set-task={{fn @controller.setModelFilter "task"}} @initial={{hash customer=@controller.selectedCustomer project=@controller.selectedProject task=@controller.selectedTask}} as |t|>
      <FilterSidebar @appliedCount={{@controller.appliedFilters.length}} @onReset={{queue t.clear @controller.reset}} as |fs|>
        <fs.group @label="Task" @expanded={{true}}>
          <fs.filter @label="Customer" data-test-filter-customer>
            <t.customer />
          </fs.filter>
          <fs.filter @label="Project" data-test-filter-project>
            <t.project />
          </fs.filter>
          <fs.filter @label="Task" data-test-filter-task>
            <t.task />
          </fs.filter>
        </fs.group>
        <fs.group @label="Responsibility">
          <fs.filter @label="User" data-test-filter-user>
            <UserSelection @user={{@controller.selectedUser}} @onChange={{fn @controller.setModelFilter "user"}} as |u|>
              <u.user />
            </UserSelection>
          </fs.filter>
          <fs.filter @label="Reviewer" data-test-filter-reviewer>
            <UserSelection @user={{@controller.selectedReviewer}} @onChange={{fn @controller.setModelFilter "reviewer"}} @queryOptions={{hash is_reviewer=1}} as |u|>
              <u.user @placeholder="Select reviewer..." />
            </UserSelection>
          </fs.filter>
        </fs.group>
        <fs.group @label="Finances">
          <fs.filter data-test-filter-billing-type @label="Billing type" @type="select" @selected={{@controller.billingType}} @valuePath="id" @labelPath="name" @prompt="All billing types" @options={{@controller.billingTypes}} @onChange={{fn (mut @controller.billingType)}} />
          <fs.filter data-test-filter-cost-center @label="Cost center" @type="select" @selected={{@controller.costCenter}} @valuePath="id" @labelPath="name" @prompt="All cost centers" @options={{@controller.costCenters}} @onChange={{fn (mut @controller.costCenter)}} />
        </fs.group>
        <fs.group @label="Time range">
          <fs.filter data-test-filter-from-date @type="date" @label="From" @selected={{@controller.fromDate}} @onChange={{fn @controller.updateParam "fromDate"}} />
          <fs.filter data-test-filter-to-date @type="date" @label="To" @selected={{@controller.toDate}} @onChange={{fn @controller.updateParam "toDate"}} />
          <DateButtons class="mt-2" @onUpdateFromDate={{fn @controller.updateParam "fromDate"}} @onUpdateToDate={{fn @controller.updateParam "toDate"}} />
        </fs.group>
        <fs.group @label="State">
          <fs.filter data-test-filter-review @label="Review" @type="button" @selected={{@controller.review}} @valuePath="value" @labelPath="label" @options={{array (hash label="All" value="") (hash label="Needed" value="1") (hash label="Not needed" value="0")}} @onChange={{fn @controller.updateParam "review"}} />
          <fs.filter data-test-filter-not-billable @label="Billability" @type="button" @selected={{@controller.notBillable}} @valuePath="value" @labelPath="label" @options={{array (hash label="All" value="") (hash label="Billable" value="0") (hash label="Not billable" value="1")}} @onChange={{fn @controller.updateParam "notBillable"}} />

          <fs.filter data-test-filter-verified @type="button" @label="Verified" @selected={{@controller.verified}} @valuePath="value" @labelPath="label" @options={{array (hash label="All" value="") (hash label="Verified" value="1") (hash label="Not verified" value="0")}} @onChange={{fn @controller.updateParam "verified"}} />
          <fs.filter data-test-filter-billed @label="Billed" @type="button" @selected={{@controller.billed}} @valuePath="value" @labelPath="label" @options={{array (hash label="All" value="") (hash label="Billed" value="1") (hash label="Not Billed" value="0")}} @onChange={{fn @controller.updateParam "billed"}} />
        </fs.group>
      </FilterSidebar>
    </TaskSelection>
  {{/unless}}

  <nav class="max-sm:border-y max-sm:shadow-sm">
    <NavTabs class="hidden sm:flex">
      {{#each @controller.types as |t|}}
        <Item>
          <A class={{if (eq t @controller.type) "active"}} {{on "click" (fn @controller.updateParam "type" t)}}>
            By
            {{t}}
          </A>
        </Item>
      {{/each}}
    </NavTabs>
    <ul class="nav-tabs [&>li>a]:text-foreground-muted [&>li>.active]:text-primary [&>li>.active]:shadow-primary flex justify-center sm:hidden [&>li>.active]:shadow-[inset_0_-2px_0] [&>li>button]:block [&>li>button]:px-3 [&>li>button]:py-1">
      {{#each @controller.mobileTypes as |t|}}
        <li>
          <button class={{if (eq t @controller.type) "active"}} type="button" {{on "click" (fn @controller.updateParam "type" t)}}>
            By
            {{t}}
          </button>
        </li>
      {{/each}}
    </ul>
  </nav>

  <div class="tab-content grid h-full pt-3">
    <NoMobileMessage class="{{if (not (includes @controller.type @controller.mobileTypes)) "sm:hidden" "hidden"}}" />
    <StatisticList class="grid-cell
        {{if (not (includes @controller.type @controller.mobileTypes)) "max-sm:hidden"}}" @data={{@controller.data}} @type={{@controller.type}} @missingParams={{@controller.missingParams}} @ordering={{@controller.ordering}} @onOrderingChange={{fn @controller.updateParam "ordering"}} />
  </div>
</PagePermission></template>