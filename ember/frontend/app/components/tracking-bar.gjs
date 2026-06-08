/**
 * @module timed
 * @submodule timed-components
 * @public
 */

/**
 * The tracking bar component
 *
 * @class TrackingBarComponent
 * @extends Ember.Component
 * @public
 */
import { fn, hash } from "@ember/helper";
import { on } from "@ember/modifier";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import perform from "ember-concurrency/helpers/perform";

import RecordButton from "timed/components/record-button";
import ReportComment from "timed/components/report-comment";
import TaskSelection from "timed/components/task-selection";
export default class TrackingBar extends Component {
  @service tracking;
  <template>
    <div class="tracking-bar mb-6 border-b pb-6" ...attributes>
      <TaskSelection
        @disabled={{this.tracking.activity.active}}
        @liveTracking={{true}}
        @on-set-task={{fn (mut this.tracking.activity.task)}}
        @initial={{hash task=this.tracking.activity.task}}
        as |t|
      >
        <label hidden form="task-form">Select task</label>
        <form
          id="task-form"
          class="grid gap-2 lg:grid-cols-[repeat(3,minmax(0,1fr)),minmax(0,1.5fr),minmax(0,auto)]"
          {{on "submit" (optional this.start)}}
        >
          <div data-test-tracking-customer>
            <t.customer />
          </div>
          <div data-test-tracking-project>
            <t.project />
          </div>
          <div data-test-tracking-task>
            <t.task />
          </div>
          <div data-test-tracking-comment>
            <ReportComment
              @value={{this.tracking.activity.comment}}
              @disabled={{this.tracking.activity.active}}
              @customerVisible={{this.tracking.activity.task.project.customerVisible}}
              @onChange={{fn (mut this.tracking.activity.comment)}}
              @onSubmit={{perform this.tracking.startActivity}}
            />
          </div>
          <div class="grid h-[2.5rem] place-self-start">
            <RecordButton
              @activity={{this.tracking.activity}}
              @recording={{this.tracking.activity.active}}
              @onStart={{perform this.tracking.startActivity}}
              @onStop={{perform this.tracking.stopActivity}}
            />
          </div>
        </form>
      </TaskSelection>
    </div>
  </template>
}
