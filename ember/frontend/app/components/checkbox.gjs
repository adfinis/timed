import { guidFor } from "@ember/object/internals";
import Component from "@glimmer/component";
import eq from "ember-truth-helpers/helpers/eq";
import { on } from "@ember/modifier";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";

export default class Checkbox extends Component {
  constructor(...args) {
    super(...args);

    this.checkboxElementId = guidFor(this);
  }
<template><div ...attributes>
  <input type="checkbox" class="rounded" id={{this.checkboxElementId}} checked={{@checked}} disabled={{@disabled}} indeterminate={{eq @checked null}} {{on "change" (pick "target.checked" (optional @onChange))}} />
  <label for={{this.checkboxElementId}} title={{@title}} class="text-sm xl:text-base">
    {{#if (has-block)}}
      {{yield}}
    {{else}}
      {{#if @label}}
        {{@label}}
      {{else}}
        &nbsp;
      {{/if}}
    {{/if}}
  </label>
</div></template>}
