import Empty from "timed/components/empty";
import LoadingIcon from "timed/components/loading-icon";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import not from "ember-truth-helpers/helpers/not";
<template>
  {{#if @data.isRunning}}
    <Empty>
      <LoadingIcon />
    </Empty>
  {{else if @data.isError}}
    <Empty>
      <FaIcon @icon="bolt" @prefix="fas" />
      <h3>Oops... Something went wrong</h3>
      <p>
        Have you tried turning it off and on again?
        <br />
        Please try refreshing the page.
      </p>
    </Empty>
  {{else if (not @data.value.length)}}
    <Empty>
      {{yield "empty" @data.value}}
    </Empty>
  {{else}}
    {{yield "body" @data.value}}
  {{/if}}
</template>
