import { hash, array, fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { VerticalCollection } from "@html-next/vertical-collection";
import slice from "@nullvoxpopuli/ember-composable-helpers/helpers/slice";
import perform from "ember-concurrency/helpers/perform";
import { runTask } from "ember-lifeline";
import { eq } from "ember-truth-helpers";

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
import { fromRow } from "timed/utils/absence-credit";
import { parseCSV, isValidCSV } from "timed/utils/csv";

class AbsenceCreditImportRow extends Component {
  get importResult() {
    return this.args.importResult;
  }

  get row() {
    return this.importResult[0];
  }

  get parsed() {
    return this.importResult[1];
  }

  get err() {
    return this.importResult[2];
  }

  get user() {
    return this.parsed ? this.parsed.user.fullName : this.row[0];
  }

  get comment() {
    return this.parsed ? this.parsed.comment : this.row[1];
  }

  get type() {
    return this.parsed ? this.parsed.absenceType.name : this.row[2];
  }

  get date() {
    return this.parsed ? this.parsed.date.toISODate() : this.row[3];
  }

  get days() {
    return this.parsed ? this.parsed.days : this.row[4];
  }

  <template>
    <div
      class="{{if this.err 'bg-red-200' 'bg-green-200'}}"
      title={{if this.err this.err}}
    >
      <div class="grid grid-cols-4">
        <div>{{this.user}}</div>
        <div>{{this.type}}</div>
        <div>{{this.date}}</div>
        <div>{{this.days}}</div>
      </div>
    </div>
  </template>
}

export default class UsersIndexTemplate extends Component {
  @service notify;
  @service users;
  @service absenceTypes;
  @service store;

  @tracked absenceCreditImportParseResults;
  @tracked pendingAbsenceCreditImport = false;

  constructor(owner, args) {
    super(owner, args);
    runTask(this, () => this.users.load(), 0); // ensure users are loaded
    runTask(this, () => this.absenceTypes.load(), 0); // ensure absence types are loaded
  }

  @action
  importAbsenceCredits() {
    const fileInput = document.getElementById(this.fileInputId);
    fileInput.click();
  }

  @action
  async doIt() {
    if (!confirm("U sure?")) return;
    const promises = this.absenceCreditImportParseResults.map(
      ([, res, err]) => {
        if (err !== null) return null;
        return this.store.createRecord("absence-credit", {
          ...res,
        });
      },
    );

    console.log(
      await Promise.all(
        (await Promise.all(promises))
          .filter(Boolean)
          .map((record) => record.save()),
      ),
    );
  }

  @action
  async onCSVUpload(e) {
    const file = e.target.files[0];
    const rawCSV = await file.text();
    const rows = parseCSV(rawCSV);
    if (!isValidCSV(rows)) {
      this.notify.error("Invalid CSV.");
      return;
    }
    const absenceCreditImportParseResults = [];
    rows.forEach((row, i) => {
      const [res, err] = fromRow(row, this.users.data, this.absenceTypes.data);
      if (err !== null && i === 0) return; // header
      absenceCreditImportParseResults.push([row, res, err]);
    });
    this.absenceCreditImportParseResults = absenceCreditImportParseResults;
    this.pendingAbsenceCreditImport = true;
  }

  get fileInputId() {
    return "file-input-thingy";
  }

  <template>
    <h1>Users</h1>

    {{#if this.pendingAbsenceCreditImport}}
      <div>
        {{#each this.absenceCreditImportParseResults as |importResult|}}
          <AbsenceCreditImportRow @importResult={{importResult}} />
        {{/each}}
        <button
          type="button"
          class="btn btn-primary"
          {{on "click" this.doIt}}
        >DO IT!</button>
      </div>

    {{/if}}

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
                    {{balanceHighlightClass
                      user.currentWorktimeBalance.balance
                    }}"
                >
                  {{formatDuration user.currentWorktimeBalance.balance false}}
                </span>
              </Td>
            </Tr>
          </VerticalCollection>
        </Table>
      {{/if}}
    </AsyncList>
    <div class="export-buttons mt-4 flex justify-start gap-x-2">
      <button
        type="button"
        class="btn btn-primary"
        title="Import Absence Credits"
        {{on "click" this.importAbsenceCredits}}
      >
        <FaIcon @icon="file-import" @prefix="fas" />Import Absence Credits</button>
      <input
        {{on "change" this.onCSVUpload}}
        id={{this.fileInputId}}
        class="hidden"
        type="file"
        accept=".csv"
      />
    </div>
  </template>
}
