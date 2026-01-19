import NavTabs from "#src/components/nav-tabs.gts";

const OPTIONS = ["year", "month", "customer", "project", "task", "user"];

<template>
  <h1 class="mb-5">Statistics</h1>
  {{outlet}}
  <NavTabs class="flex" as |n|>
    {{#each OPTIONS as |op|}}
      <n.tab><n.link @route="statistics.{{op}}">By {{op}}</n.link></n.tab>
    {{/each}}
  </NavTabs>
</template>
