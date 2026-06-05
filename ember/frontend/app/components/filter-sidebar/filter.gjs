import { uniqueId, get, fn } from "@ember/helper";
import not from "ember-truth-helpers/helpers/not";
import or from "ember-truth-helpers/helpers/or";
import eq from "ember-truth-helpers/helpers/eq";
import { on } from "@ember/modifier";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import Datepicker from "timed/components/datepicker";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
<template>
  <div ...attributes>
    {{#let (uniqueId) as |id|}}
      <label for={{id}} hidden={{not @label}}>{{or
          @label
          @name
          "search"
        }}</label>
      {{#if (eq @type "button")}}
        <div id={{id}} class="btn-group flex flex-nowrap [&>*]:w-full">
          {{#each @options as |opt|}}
            <button
              class="btn
                {{if
                  (eq (get opt @valuePath) @selected)
                  'btn-primary active'
                  'btn-default'
                }}
                "
              type="button"
              {{on "click" (fn (optional @onChange) (get opt @valuePath))}}
            >
              {{get opt @labelPath}}
            </button>
            {{yield}}
          {{/each}}
        </div>
      {{else if (eq @type "date")}}
        <Datepicker
          @id={{id}}
          @value={{@selected}}
          @onChange={{optional @onChange}}
          @placeholder={{@placeholder}}
          @name={{or @name "date"}}
        />
      {{else if (eq @type "search")}}
        <input
          type="search"
          class="form-control rounded"
          placeholder={{or @placeholder "Search"}}
          name={{or @name "search"}}
          id={{id}}
          value={{@selected}}
          {{on "input" (pick "target.value" (optional @onChange))}}
          {{on "change" (pick "target.value" (optional @onChange))}}
        />
      {{else if (eq @type "select")}}
        <select
          id={{id}}
          class="form-control rounded"
          {{on "change" (pick "target.value" (optional @onChange))}}
        >
          {{#if @prompt}}
            <option value>{{@prompt}}</option>
          {{/if}}
          {{#each @options as |opt|}}
            <option
              value={{get opt @valuePath}}
              selected={{if (eq @selected (get opt @valuePath)) "selected"}}
            >
              {{get opt @labelPath}}
            </option>
          {{/each}}
          {{yield}}
        </select>
      {{else}}
        {{yield}}
      {{/if}}
    {{/let}}
  </div>
</template>
