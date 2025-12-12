import Checkbox from "ui-core/components/checkbox";
import {
  default as Durationpicker,
  ActivityDurationpicker,
  ReportDurationpicker,
} from "ui-core/components/durationpicker";
import PageHeading from "../components/page-heading";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { Duration } from "luxon";
import { hash } from "@ember/helper";
import TaskSelection, { PROJECTS } from "ui-core/components/task-selection";
import { get } from "@ember/helper";

export default class FormTemplate extends Component {
  @tracked a = false;
  @tracked b = true;
  @tracked c = null as boolean | null;

  @tracked duration = Duration.fromObject({ hours: 1 });
  @tracked duration2 = Duration.fromObject({ hours: 0, minutes: 47 });
  @tracked duration3 = Duration.fromObject({
    hours: 0,
    minutes: 12,
    seconds: 13,
  });
  @tracked duration4 = Duration.fromObject({
    hours: -200,
    minutes: 12,
    seconds: 13,
  });

  logChange = (...args: unknown[]) => console.log(...args);

  <template>
    <PageHeading>Form</PageHeading>
    <form class="grid gap-1">
      <TaskSelection @showTasksAsRecent={{true}} @onChange={{this.logChange}} />
      <TaskSelection @onChange={{this.logChange}} @project={{get PROJECTS 0}} />

      <ReportDurationpicker
        @value={{this.duration}}
        @onChange={{fn (mut this.duration)}}
        maxlength="6"
      />

      <ActivityDurationpicker
        @value={{this.duration2}}
        @onChange={{fn (mut this.duration2)}}
        maxlength="6"
      />

      <ActivityDurationpicker
        @value={{this.duration3}}
        @onChange={{fn (mut this.duration3)}}
        disabled="true"
      />

      <Durationpicker
        @min={{Duration.fromObject (hash years=-2000)}}
        @max={{Duration.fromObject (hash years=2000)}}
        @value={{this.duration4}}
        @onChange={{fn (mut this.duration4)}}
      />

      <label for="comment" class="hidden">comment</label>
      <input id="comment" type="text" placeholder="Comment" name="comment" />
      <div class="flex gap-6">
        <Checkbox
          @label="a"
          @checked={{this.a}}
          @onChange={{fn (mut this.a)}}
        />
        <Checkbox
          @label="b"
          @checked={{this.b}}
          @onChange={{fn (mut this.b)}}
        />
        <Checkbox
          @label="c"
          @checked={{this.c}}
          @onChange={{fn (mut this.c)}}
        />
      </div>
    </form>
  </template>
}
