import { action } from "@ember/object";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { scheduleTask } from "ember-lifeline";
import { on } from "@ember/modifier";
import VerticalCollection from "@html-next/vertical-collection/components/vertical-collection/component";
import emberPowerSelectIsEqual from "ember-power-select/helpers/ember-power-select-is-equal";
import eq from "ember-truth-helpers/helpers/eq";
import ensureSafeComponent from "@embroider/util/_app_/helpers/ensure-safe-component.js";

const isTouchDevice = !!window && "ontouchstart" in window;

export default class OptimizedPowerSelectOptionsComponent extends Component {
  isTouchDevice = isTouchDevice;

  @tracked trackTouchMove = false;
  @tracked hasMoved = false;

  get isTesting() {
    if (macroCondition(isTesting())) {
      return true;
    }
    return false;
  }

  constructor(...args) {
    super(...args);
    scheduleTask(
      this.args.select.actions,
      "actions",
      "scrollTo",
      this.args.select.highlighted,
    );
  }

  @action
  onEvent(e) {
    if (e.type.startsWith("touch") && !this.isTouchDevice) {
      return;
    }
    const EVENT_TYPE_MAP = {
      mouseup: () =>
        this.findOptionAndPerform(this.args.select.actions.choose, e),
      mouseover: () =>
        this.args.highlightOnHover &&
        this.findOptionAndPerform(this.args.select.actions.highlight, e),
      touchstart: () => {
        this.trackTouchMove = true;
      },
      touchmove: () => {
        if (!this.trackTouchMove) return;
        this.hasMoved = true;
      },
      touchend: () => {
        this.trackTouchMove = false;
        const optionItem = e.target.closest("[data-option-index]");

        if (!optionItem) {
          return;
        }

        e.preventDefault();
        if (this.hasMoved) {
          this.hasMoved = false;
          return;
        }

        if (optionItem.closest("[aria-disabled=true]")) {
          return; // Abort if the item or an ancestor is disabled
        }

        const optionIndex = optionItem.getAttribute("data-option-index");
        this.args.select.actions.choose(this._optionFromIndex(optionIndex), e);
      },
    };
    EVENT_TYPE_MAP[e.type]();
  }

  findOptionAndPerform(action, e) {
    const optionItem = e.target.closest("[data-option-index]");
    if (!optionItem) {
      return;
    }
    if (optionItem.closest("[aria-disabled=true]")) {
      return; // Abort if the item or an ancestor is disabled
    }
    const optionIndex = optionItem.getAttribute("data-option-index");
    action(this._optionFromIndex(optionIndex), e);
  }

  _optionFromIndex(index) {
    const parts = index.split(".");
    let option = this.args.options[parseInt(parts[0], 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i], 10)];
    }
    return option;
  }
<template><ul role="listbox" class="ember-power-select-options" {{on "touchmove" this.onEvent}} {{on "touchstart" this.onEvent}} {{on "touchend" this.onEvent}} {{!-- template-lint-disable no-invalid-interactive --}} {{on "mouseup" this.onEvent}} {{on "mouseover" this.onEvent}} ...attributes>
  {{#if @select.loading}}
    {{#if @loadingMessage}}
      <li class="ember-power-select-option ember-power-select-option--loading-message" role="option" aria-selected="false">{{@loadingMessage}}</li>
    {{/if}}
  {{/if}}

  <VerticalCollection @items={{@options}} @estimateHeight={{30}} @bufferSize={{5}} @renderAll={{this.isTesting}} as |option index|>
    {{!--template-lint-disable  require-context-role--}}
    <li class="ember-power-select-option" aria-selected="{{emberPowerSelectIsEqual option @select.selected}}" aria-disabled="{{option.disabled}}" aria-current="{{eq option @select.highlighted}}" data-option-index="{{@groupIndex}}{{index}}" role="option">
      {{#if @extra.optionTemplate}}
        {{component (ensureSafeComponent @extra.optionTemplate) option=option current=(eq option @select.highlighted)}}
      {{else}}
        {{yield option @select}}
      {{/if}}
    </li>
  </VerticalCollection>
</ul></template>}
