import { on } from "@ember/modifier";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import and from "ember-truth-helpers/helpers/and";
import not from "ember-truth-helpers/helpers/not";

export default class OptimizedPowerSelectTriggerComponent extends Component {
  @action
  clear(e) {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === "touchstart") {
      return false;
    }
  }
  <template>
    {{#if @select.selected}}
      {{#if @selectedItemComponent}}
        <@selectedItemComponent
          @option={{readonly @select.selected}}
          @select={{readonly @select}}
        />
      {{else}}
        <span class="ember-power-select-selected-item truncate">
          {{#if @extra.selectedTemplate}}
            <@extra.selectedTemplate @selected={{@select.selected}} />
          {{else}}
            {{yield @select.selected @select}}
          {{/if}}
        </span>
      {{/if}}
      {{#if (and @allowClear (not @select.disabled))}}
        <span
          role="button"
          class="ember-power-select-clear-btn"
          {{on "mouseup" this.clear}}
          {{on "ontouchend" this.clear}}
        >&times;</span>
      {{/if}}
    {{else}}
      <@placeholderComponent @placeholder={{@placeholder}} />
    {{/if}}
    <span class="ember-power-select-status-icon"></span>
  </template>
}
