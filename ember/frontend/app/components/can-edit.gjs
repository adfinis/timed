import can from "ember-can/helpers/can";
import awaitHelper from "ember-promise-helpers/helpers/await";

<template>{{#let (can "editSync report" @report) as |sync|}}
  {{#if sync}}
    {{yield true}}
  {{else}}
    {{#let (can "editAsync report" @report) as |promise|}}
      {{yield (awaitHelper promise)}}
    {{/let}}
  {{/if}}
{{/let}}</template>