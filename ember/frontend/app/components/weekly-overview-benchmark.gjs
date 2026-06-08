import Component from "@glimmer/component";
import style from "ember-style-modifier";

export default class WeeklyOverviewBenchmark extends Component {
  /**
   * Maximum worktime
   *
   * This is 'only' 20h since noone works 24h a day..
   *
   * @property {Number} max
   * @public
   */
  get max() {
    return this.args.max || 20;
  }

  /**
   * The offset to the bottom
   *
   * @property {String} style
   * @public
   */
  get style() {
    return { bottom: `calc(100% / ${this.max} * ${this.args.hours})` };
  }
  <template>
    <div class="absolute inset-0 flex items-center">
      {{#if @showLabel}}
        <span
          class="absolute -left-8 right-0 w-6 translate-y-1/2 text-center text-xs
            {{unless @expected 'text-foreground-muted'}}"
          {{style this.style}}
        >{{@hours}}h</span>
      {{/if}}
      <hr
        {{style this.style}}
        class="absolute left-0 right-0 m-0 w-full border-none p-0
          {{if @expected 'bg-tertiary/60 h-[1.5px]' 'bg-primary/30 h-px'}}"
      />
    </div>
  </template>
}
