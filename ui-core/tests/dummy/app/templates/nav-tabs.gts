import pageTitle from "ember-page-title/helpers/page-title";
import NavTabs from "ui-core/components/nav-tabs";
import PageHeading from "../components/page-heading";

<template>
  {{pageTitle "Nav Tabs"}}
  <PageHeading class="mb-5">Nav Tabs</PageHeading>
  <NavTabs class="flex" as |n|>
    <n.tab><n.link @route="nav-tabs.index">hello</n.link></n.tab>
    <n.tab><n.link @route="nav-tabs.other">other</n.link></n.tab>
  </NavTabs>

  {{outlet}}
</template>
