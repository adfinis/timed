import NavTabs from "#src/components/nav-tabs.gts";
import Layout from "../components/layout.gts";

const OPTIONS = ["year", "month", "customer", "project", "task", "user"];

<template>
  <Layout>
    <:header>
      <h1 class="mb-5">Statistics</h1>
      <NavTabs class="flex" as |n|>
        {{#each OPTIONS as |op|}}
          <n.tab><n.link @route="statistics.{{op}}">By {{op}}</n.link></n.tab>
        {{/each}}
      </NavTabs>
    </:header>
    <:main>{{outlet}}</:main>
  </Layout>
</template>
