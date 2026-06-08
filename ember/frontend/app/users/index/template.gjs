import { hash, array, fn } from "@ember/helper";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import VerticalCollection from "@html-next/vertical-collection/components/vertical-collection/component";
import slice from "@nullvoxpopuli/ember-composable-helpers/helpers/slice";
import perform from "ember-concurrency/helpers/perform";
import eq from "ember-truth-helpers/helpers/eq";

import AsyncList from "timed/components/async-list";
import Empty from "timed/components/empty";
import FilterSidebar from "timed/components/filter-sidebar";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Th from "timed/components/table/th";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import UserSelection from "timed/components/user-selection";
import balanceHighlightClass from "timed/helpers/balance-highlight-class";
import formatDuration from "timed/helpers/format-duration";
<template>
  <h1>Users</h1>

  <FilterSidebar @onReset={{perform @controller.resetFilter}} as |fs|>
    <fs.group @label="General" @expanded={{true}}>
      <fs.label>
        Search
        <fs.filter
          @type="search"
          data-test-filter-search="true"
          @selected={{@controller.search}}
          @onChange={{perform @controller.setSearchFilter}}
        />
      </fs.label>
      {{#if @controller.currentUser.user.isSuperuser}}
        <fs.label>
          Supervisor
          <fs.filter data-test-filter-user>
            <UserSelection
              @user={{@controller.selectedSupervisor}}
              @onChange={{perform @controller.setModelFilter "supervisor"}}
              @queryOptions={{hash is_supervisor=1 active=1}}
              as |u|
            >
              <u.user @placeholder="Select supervisor..." />
            </UserSelection>
          </fs.filter>
        </fs.label>
      {{/if}}
      <fs.label>
        Active
        <fs.filter
          @type="button"
          data-test-filter-active="true"
          @selected={{@controller.active}}
          @valuePath="value"
          @labelPath="label"
          @options={{array
            (hash value="" label="All")
            (hash value="1" label="Active")
            (hash value="0" label="Inactive")
          }}
          @onChange={{fn (mut @controller.active)}}
        />
      </fs.label>
    </fs.group>
  </FilterSidebar>

  <AsyncList @data={{@controller.fetchData}} as |section data|>
    {{#if (eq section "empty")}}
      <Empty>
        <FaIcon @icon="users" @prefix="fas" />
        <h3>No users to display</h3>
        <p>Maybe try loosening your filters</p>
      </Empty>
    {{else if (eq section "body")}}
      <Table class="table--striped table--hover table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Percentage</Th>
            <Th>Worktime per day</Th>
            <Th>Current worktime balance</Th>
          </Tr>
        </Thead>
        <VerticalCollection
          @items={{slice data}}
          @tagName="tbody"
          @estimateHeight={{40}}
          @bufferSize={{10}}
          @containerSelector=".page-content--scroll"
          as |user|
        >
          <Tr
            @striped={{true}}
            @hover={{true}}
            @last={{true}}
            role="link"
            {{on "click" (fn @controller.viewUserProfile user.id)}}
          >
            <Td
              class={{unless user.isActive "text-danger"}}
            >{{user.fullName}}</Td>
            {{#if user.activeEmployment}}
              <Td>{{user.activeEmployment.percentage}}%</Td>
              <Td>{{formatDuration
                  user.activeEmployment.worktimePerDay
                  false
                }}</Td>
            {{else}}
              <Td class={{unless user.isActive "text-danger"}} colspan="2"><em
                >User has no active employment</em></Td>
            {{/if}}
            <Td>
              <span
                class="worktime-balance
                  {{balanceHighlightClass user.currentWorktimeBalance.balance}}"
              >
                {{formatDuration user.currentWorktimeBalance.balance false}}
              </span>
            </Td>
          </Tr>
        </VerticalCollection>
      </Table>
    {{/if}}
  </AsyncList>
</template>
