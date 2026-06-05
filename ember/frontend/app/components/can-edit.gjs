import can from "ember-can/helpers/can";
import await from "ember-promise-helpers/helpers/await";
<template>{{#let (can "editSync report" @report) as |sync|}}
  {{#if sync}}
    {{yield true}}
  {{else}}
    {{#let (can "editAsync report" @report) as |promise|}}
      {{yield (await promise)}}
    {{/let}}
  {{/if}}
{{/let}}</template>