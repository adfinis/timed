import EmberNotify from "ember-notify/components/ember-notify";
import pageTitle from "ember-page-title/helpers/page-title";

<template>
  {{pageTitle "ui-core"}}

  <EmberNotify @messageStyle="bootstrap" />
  <main class="p-2 grid">
    {{outlet}}
  </main>
</template>
