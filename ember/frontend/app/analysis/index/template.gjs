import { fn, hash, uniqueId, array } from "@ember/helper";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import includes from "@nullvoxpopuli/ember-composable-helpers/helpers/includes";
import noop from "@nullvoxpopuli/ember-composable-helpers/helpers/noop";
import queue from "@nullvoxpopuli/ember-composable-helpers/helpers/queue";
import perform from "ember-concurrency/helpers/perform";
import inViewport from "ember-in-viewport/modifiers/in-viewport";
import { and, eq, not, notEq, or } from "ember-truth-helpers";
import LoadingIcon from "ui-core/components/loading-icon";

import CanEdit from "timed/components/can-edit";
import Checkmark from "timed/components/checkmark";
import DateButtons from "timed/components/date-buttons";
import Empty from "timed/components/empty";
import FilterSidebar from "timed/components/filter-sidebar";
import NoMobileMessage from "timed/components/no-mobile-message";
import PagePermission from "timed/components/page-permission";
import ScrollContainer from "timed/components/scroll-container";
import SortHeader from "timed/components/sort-header";
import Table from "timed/components/table";
import Td from "timed/components/table/td";
import Tfoot from "timed/components/table/tfoot";
import Th from "timed/components/table/th";
import Thead from "timed/components/table/thead";
import Tr from "timed/components/table/tr";
import TaskSelection from "timed/components/task-selection";
import UserSelection from "timed/components/user-selection";
import formatDuration from "timed/helpers/format-duration";
import luxonFormat from "timed/helpers/luxon-format";
import media from "timed/helpers/media";

const Colgroup = <template>
  <colgroup>
    <col class="w-[7%]" />
    <col class="w-[7%]" />
    <col class="w-[7%]" />
    <col class="w-[10%]" />
    <col class="w-[10%]" />
    <col class="w-[10%]" />
    <col class="w-[21%]" />
    <col class="w-[8%]" />
    <col class="w-[5%]" />
    <col class="w-[5%]" />
    <col class="w-[5%]" />
    <col class="w-[5%]" />
  </colgroup>
</template>;

const AnalysisIndexTemplate = <template>
  {{#if (not (media "isMd"))}}
    <NoMobileMessage />
  {{else}}
    <PagePermission>
      <h1 class="mb-6">Analysis</h1>

      {{#unless @controller.prefetchData.isRunning}}
        <TaskSelection
          @history={{false}}
          @archived={{true}}
          @on-set-customer={{fn @controller.setModelFilter "customer"}}
          @on-set-project={{fn @controller.setModelFilter "project"}}
          @on-set-task={{fn @controller.setModelFilter "task"}}
          @initial={{hash
            customer=@controller.selectedCustomer
            project=@controller.selectedProject
            task=@controller.selectedTask
            comment=@controller.comment
          }}
          as |t|
        >
          <FilterSidebar
            @appliedCount={{@controller.appliedFilters.length}}
            @onReset={{queue t.clear @controller.reset}}
            class="max-sm:hidden"
            as |fs|
          >
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
              <fs.filter @label="Comment" data-test-filter-comment>
                {{#let (uniqueId) as |id|}}
                  <label for={{id}} hidden>comment</label>
                  <input
                    id={{id}}
                    value={{@controller.comment}}
                    {{on
                      "change"
                      (fn @controller.setModelFilterOnChange "comment")
                    }}
                    class="form-control comment-field rounded"
                    placeholder="Comment"
                    name="comment"
                    type="text"
                  />
                {{/let}}
              </fs.filter>
            </fs.group>
            <fs.group @label="Responsibility">
              <fs.filter @label="User" data-test-filter-user>
                <UserSelection
                  @user={{@controller.selectedUser}}
                  @onChange={{fn @controller.setModelFilter "user"}}
                  as |u|
                >
                  <u.user />
                </UserSelection>
              </fs.filter>

              <fs.filter @label="Reviewer" data-test-filter-reviewer>
                <UserSelection
                  @user={{@controller.selectedReviewer}}
                  @onChange={{fn @controller.setModelFilter "reviewer"}}
                  @queryOptions={{hash is_reviewer=1}}
                  as |u|
                >
                  <u.user @placeholder="Select reviewer..." />
                </UserSelection>
              </fs.filter>
            </fs.group>
            <fs.group @label="Finances">
              <fs.filter
                data-test-filter-billing-type
                @label="Billing type"
                @type="select"
                @selected={{@controller.billingType}}
                @valuePath="id"
                @labelPath="name"
                @prompt="All billing types"
                @options={{@controller.billingTypes}}
                @onChange={{fn (mut @controller.billingType)}}
              />
              <fs.filter
                data-test-filter-cost-center
                @label="Cost center"
                @type="select"
                @selected={{@controller.costCenter}}
                @valuePath="id"
                @labelPath="name"
                @prompt="All cost centers"
                @options={{@controller.costCenters}}
                @onChange={{fn (mut @controller.costCenter)}}
              />
            </fs.group>
            <fs.group @label="Time range">
              <fs.filter
                data-test-filter-from-date
                @label="From"
                @type="date"
                @selected={{if
                  @controller.fromDate
                  (@controller.dateFromString @controller.fromDate)
                }}
                @onChange={{fn @controller.updateParam "fromDate"}}
              />
              <fs.filter
                data-test-filter-to-date
                @label="To"
                @type="date"
                @selected={{if
                  @controller.toDate
                  (@controller.dateFromString @controller.toDate)
                }}
                @onChange={{fn @controller.updateParam "toDate"}}
              />
              <DateButtons
                class="mt-3"
                @onUpdateFromDate={{fn @controller.updateParam "fromDate"}}
                @onUpdateToDate={{fn @controller.updateParam "toDate"}}
              />
            </fs.group>
            <fs.group @label="State">
              <fs.filter
                data-test-filter-review
                @label="Review"
                @type="button"
                @selected={{@controller.review}}
                @valuePath="value"
                @labelPath="label"
                @options={{array
                  (hash label="All" value="")
                  (hash label="Needed" value="1")
                  (hash label="Not needed" value="0")
                }}
                @onChange={{fn @controller.updateParam "review"}}
              />
              <fs.filter
                data-test-filter-not-billable
                @type="button"
                @label="Billability"
                @selected={{@controller.notBillable}}
                @valuePath="value"
                @labelPath="label"
                @options={{array
                  (hash label="All" value="")
                  (hash label="Billable" value="0")
                  (hash label="Not billable" value="1")
                }}
                @onChange={{fn @controller.updateParam "notBillable"}}
              />
              <fs.filter
                data-test-filter-verified
                @type="button"
                @label="Verified"
                @selected={{@controller.verified}}
                @valuePath="value"
                @labelPath="label"
                @options={{array
                  (hash label="All" value="")
                  (hash label="Verified" value="1")
                  (hash label="Not verified" value="0")
                }}
                @onChange={{fn @controller.updateParam "verified"}}
              />
              <fs.filter
                data-test-filter-billed
                @label="Billed"
                @type="button"
                @selected={{@controller.billed}}
                @valuePath="value"
                @labelPath="label"
                @options={{array
                  (hash label="All" value="")
                  (hash label="Billed" value="1")
                  (hash label="Not Billed" value="0")
                }}
                @onChange={{fn @controller.updateParam "billed"}}
              />
              <fs.filter
                data-test-filter-editable
                @label="Editable"
                @type="button"
                @selected={{@controller.editable}}
                @valuePath="value"
                @labelPath="label"
                @options={{array
                  (hash label="All" value="")
                  (hash label="Editable" value="1")
                }}
                @onChange={{fn @controller.updateParam "editable"}}
              />
              <fs.filter
                data-test-filter-rejected
                @type="button"
                @label="Rejected"
                @selected={{@controller.rejected}}
                @valuePath="value"
                @labelPath="label"
                @options={{array
                  (hash label="All" value="")
                  (hash label="Rejected" value="1")
                  (hash label="Not rejected" value="0")
                }}
                @onChange={{fn @controller.updateParam "rejected"}}
              />

            </fs.group>
          </FilterSidebar>
        </TaskSelection>
      {{/unless}}

      {{#if @controller.appliedFilters.length}}
        {{#if
          (and (not @controller._dataCache.length) @controller.data.isRunning)
        }}
          <Empty>
            <LoadingIcon />
          </Empty>
        {{else}}
          {{#if @controller.data.lastSuccessful.value.length}}
            {{#let @controller.data.lastSuccessful.value as |reports|}}
              <div class="flex justify-end gap-x-2">
                {{#if @controller.selectedReportIds.length}}
                  <button
                    data-test-edit-selected
                    type="button"
                    class="btn btn-success"
                    {{on
                      "click"
                      (fn @controller.edit @controller.selectedReportIds)
                    }}
                  >
                    Edit
                    {{@controller.selectedReportIds.length}}
                    selected report{{if
                      (notEq @controller.selectedReportIds.length 1)
                      "s"
                    }}
                  </button>
                {{/if}}
                <button
                  data-test-edit-all
                  type="button"
                  class="btn btn-default"
                  title={{unless
                    @controller.editable
                    'Please enable the "editable" filter to modify all entries at once.'
                  }}
                  disabled={{unless @controller.editable "true"}}
                  {{on "click" @controller.edit}}
                >
                  Edit all
                </button>
              </div>

              {{! template-lint-disable table-groups }}
              <Table class="table--striped table--analysis table">
                <Colgroup />
                <Thead>
                  <Tr>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="user__username"
                    >User</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="date"
                    >Date</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="duration"
                    >Duration</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="task__project__customer__name"
                    >Customer</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="task__project__name"
                    >Project</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="task__name"
                    >Task</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="comment"
                    >Comment</SortHeader>
                    <SortHeader
                      @update={{fn @controller.updateParam "ordering"}}
                      @current={{@controller.ordering}}
                      @by="verified_by__username"
                    >Verified by</SortHeader>
                    <Th @light={{true}}>Rejected</Th>
                    <Th @light={{true}}>Review</Th>
                    <Th @light={{true}}>Not billable</Th>
                    <Th @light={{true}}>Billed</Th>
                  </Tr>
                </Thead>
              </Table>
              <ScrollContainer class="analysis-scrollable-container">
                <Table class="table--striped table--analysis table table-fixed">
                  <Colgroup />
                  <tbody>
                    {{#each reports as |report|}}
                      {{! template-lint-disable}}
                      <CanEdit @report={{report}} as |canEdit|>
                        <Tr
                          class="{{if
                              (includes report.id @controller.selectedReportIds)
                              'selected bg-primary text-foreground-primary'
                              'striped'
                            }}
                            {{if
                              (or @controller.isAccountant canEdit)
                              'text-foreground-accent cursor-pointer'
                            }}
                            shadow-foreground/5 align-top shadow transition-colors"
                          {{on
                            "click"
                            (if
                              (or @controller.isAccountant canEdit)
                              (fn @controller.selectRow report)
                              (noop)
                            )
                          }}
                        >
                          <Td>{{report.user.username}}</Td>
                          <Td>{{luxonFormat report.date "dd.MM.yyyy"}}</Td>
                          <Td>{{formatDuration report.duration false}}</Td>
                          <Td>{{report.task.project.customer.name}}</Td>
                          <Td>{{report.task.project.name}}</Td>
                          <Td>{{report.task.name}}</Td>
                          <Td><span
                              class="line-clamp-2 whitespace-pre-line"
                              title="{{report.comment}}"
                            >{{report.comment}}</span></Td>
                          <Td>{{if
                              report.verifiedBy
                              report.verifiedBy.username
                            }}</Td>
                          <Td><Checkmark
                              @checked={{report.rejected}}
                              @highlight={{true}}
                            /></Td>
                          <Td><Checkmark
                              @checked={{report.review}}
                              @highlight={{true}}
                            /></Td>
                          <Td><Checkmark
                              @checked={{report.notBillable}}
                              @highlight={{true}}
                            /></Td>
                          <Td><Checkmark
                              @checked={{report.billed}}
                              @highlight={{true}}
                            /></Td>
                        </Tr>
                      </CanEdit>
                    {{/each}}
                    {{#if @controller._canLoadMore}}
                      <tr
                        {{inViewport
                          onEnter=(perform @controller.loadNext)
                          onExit=(fn (mut @controller._shouldLoadMore) false)
                          viewportSpy=true
                        }}
                      >
                        <td colspan="12" class="text-center">
                          Loading<span class="loading-dots"><i>.</i><i>.</i><i
                            >.</i></span>
                        </td>
                      </tr>
                    {{/if}}
                  </tbody>
                </Table>
              </ScrollContainer>
              <Table class="table--striped table--analysis table table-fixed">
                <Colgroup />
                <Tfoot>
                  <Tr>
                    <Td colspan="2">Total:</Td>

                    <Td colspan="2"><strong class="total">{{formatDuration
                          @controller.totalTime
                          false
                        }}</strong></Td><Td colspan="8" class="text-right">
                      <em>Displaying
                        {{reports.length}}
                        of
                        {{@controller.totalItems}}
                        reports</em>

                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
              <div class="export-buttons mt-4 flex justify-end gap-x-2">
                {{#each @controller.exportLinks as |link|}}
                  <button
                    {{on "click" (fn (perform @controller.download) link)}}
                    type="button"
                    data-download-count="{{@controller.download.performCount}}"
                    class="btn btn-primary
                      {{if
                        (and
                          (eq @controller.download.last.url link.url)
                          (eq @controller.download.last.params link.params)
                          @controller.download.isRunning
                        )
                        'loading'
                      }}"
                    disabled={{@controller.exportLimitExceeded}}
                    title={{if
                      @controller.exportLimitExceeded
                      @controller.exportLimitMessage
                    }}
                  >
                    <FaIcon
                      @icon="download"
                      @prefix="fas"
                    />&nbsp;{{link.label}}
                  </button>
                {{/each}}
              </div>
            {{/let}}
          {{else}}
            <Empty data-test-widen-filters>
              <FaIcon @icon="magnifying-glass" @prefix="fas" />
              <h3>0 Results</h3>
              <p>Maybe widen your filters</p>
            </Empty>
          {{/if}}
        {{/if}}
      {{else}}
        <Empty data-test-apply-filters>
          <FaIcon @icon="magnifying-glass" @prefix="fas" />
          <h3>Apply filters to display reports</h3>
        </Empty>
      {{/if}}
    </PagePermission>
  {{/if}}
</template>;

export default AnalysisIndexTemplate;
