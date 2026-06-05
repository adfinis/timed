import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import style_ from "ember-style-modifier/modifiers/style";
import WeeklyOverviewBenchmark from "timed/components/weekly-overview-benchmark";

export default class WeeklyOverview extends Component {
  @tracked height = 150;

  get hours() {
    return this.args.expected.as("hours");
  }

  get style() {
    return { height: `${this.height}px` };
  }
  <template>
    <div
      {{style_ this.style}}
      class="flex w-full overflow-hidden pb-12 pl-8 pt-5 sm:pl-10 md:pl-12"
      ...attributes
    >
      <div class="relative flex flex-grow items-end justify-around">
        <WeeklyOverviewBenchmark @showLabel={{true}} @hours={{20}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{18}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{16}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{14}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{12}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{10}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{8}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{6}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{4}} />
        <WeeklyOverviewBenchmark @showLabel={{false}} @hours={{2}} />
        <WeeklyOverviewBenchmark @showLabel={{true}} @hours={{0}} />
        <WeeklyOverviewBenchmark
          @showLabel={{true}}
          @hours={{this.hours}}
          @expected={{true}}
        />
        {{yield}}
      </div>
    </div>
  </template>
}
