import { action } from "@ember/object";
import Component from "@glimmer/component";
import Th from "timed/components/table/th";
import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";

export default class SortHeader extends Component {
  get direction() {
    return this.args.current?.startsWith("-") ? "down" : "up";
  }

  get getColname() {
    return this.args.current?.startsWith("-")
      ? this.args.current.substring(1)
      : this.args.current;
  }

  get active() {
    return this.getColname === this.args.by;
  }

  @action
  click() {
    const by = this.args.by;
    const sort = this.active && this.direction === "down" ? by : `-${by}`;

    this.args.update(sort);
  }
<template><Th @light={{true}} class="sort-header cursor-pointer whitespace-nowrap align-bottom" {{on "click" this.click}} ...attributes>
  {{yield}}
  {{#if this.active}}
    <FaIcon @size="xs" @prefix="fas" @icon="sort-{{this.direction}}" />
  {{else}}
    <FaIcon @size="xs" @prefix="fas" @icon="sort" />
  {{/if}}
</Th></template>}
