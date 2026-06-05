import { action } from "@ember/object";
import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";

export default class ReportCommentTextarea extends Component {
  get tooltip() {
    const parts = [];
    if (this.args.customerVisible) {
      parts.push("This project's comments are visible to the customer");
      parts.push("===================================================");
      parts.push("");
    }
    parts.push(this.args.value);
    return parts.join("\n");
  }

  get lines() {
    return (this.args.value || "").split("\n").length;
  }

  get heightClass() {
    if (this.lines < 2) {
      return "";
    }

    return this.lines === 2 ? "focus:h-16" : "focus:h-24";
  }

  @action
  handleKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const { onSubmit } = this.args;
      onSubmit && onSubmit(event);
    }
  }
<template><textarea type="text" class="comment-field resize-none overflow-hidden rounded transition-[height] duration-300 ease-in-out
    {{if @customerVisible "customer-comment"}}
    {{this.heightClass}}" placeholder="Comment" name="comment" id="row-comment" value={{@value}} disabled={{@disabled}} title={{this.tooltip}} spellcheck="true" autocomplete="true" wrap="soft" rows="1" {{on "input" (pick "target.value" @onChange)}} {{on "keydown" this.handleKeydown}} data-test-report-comment /></template>}
