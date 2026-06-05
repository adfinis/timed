import Component from "@glimmer/component";
import style_ from "ember-style-modifier/modifiers/style";
import { concat } from "@ember/helper";
import and from "ember-truth-helpers/helpers/and";
import lte from "ember-truth-helpers/helpers/lte";
import gt from "ember-truth-helpers/helpers/gt";
import min from "ember-math-helpers/helpers/min";

export default class StatisticListBar extends Component {
  get didFinishEffortsInBudget() {
    return (
      this.args.remaining === 0 &&
      !this.didFinishEffortsOverBudget &&
      this.args.archived
    );
  }

  get didFinishEffortsOverBudget() {
    return this.args.value > this.args.goal;
  }

  get spentEffortsBarColor() {
    if (this.didFinishEffortsInBudget) {
      return "before:bg-success";
    }
    if (this.didFinishEffortsOverBudget) {
      return "before:bg-danger";
    }
    return "before:bg-primary";
  }
  <template>
    <div
      class="statistic-list-bar-wrapper relative h-5 [&>*]:absolute [&>*]:h-5 [&>*]:w-full [&>*]:overflow-hidden [&>*]:before:block [&>*]:before:h-full [&>*]:before:w-full [&>*]:before:-translate-x-[calc((1-var(--value))*100%)]"
    >
      <div
        ...attributes
        class="statistic-list-bar
          {{this.spentEffortsBarColor}}
          z-10 before:rounded-r"
        {{style_ --value=(concat @value)}}
      ></div>
      {{#if (and @remaining (lte @remaining 1))}}
        <div
          ...attributes
          class="statistic-list-bar remaining before:rounded-r
            {{if (gt @remaining @goal) 'before:bg-danger' 'before:bg-success'}}"
          {{style_ --value=(concat @remaining)}}
        ></div>
      {{/if}}
      {{#if @goal}}
        <div
          ...attributes
          class="statistic-list-bar-goal z-20 before:border-r-2 before:border-dotted
            {{if
              (gt @value @goal)
              'before:border-foreground-primary'
              'before:border-danger'
            }}"
          {{style_ --value=(concat (min "0.99" @goal))}}
        ></div>
      {{/if}}
    </div>
  </template>
}
