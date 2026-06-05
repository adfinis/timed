import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import { LinkTo } from "@ember/routing";
import TimedClock from "timed/components/timed-clock";
import List from "timed/components/topnav/list";
import ListItem from "timed/components/topnav/list-item";
import LinkTo0 from "timed/components/topnav/link-to";
import { fn } from "@ember/helper";
import can from "ember-can/helpers/can";
import ReportReviewWarning from "timed/components/report-review-warning";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import config from "timed/config/environment";

export default class Topnav extends Component {
  @service currentUser;

  @service media;

  @service docs;

  @tracked expand = false;

  get navMobile() {
    return !this.media.isSm;
  }
<template><div class="fixed left-0 top-0 z-40 w-full">
  <nav class="bg-background dark:bg-background-muted flex w-full flex-col px-2 py-1 shadow-md transition-all md:flex-row lg:px-3.5 lg:py-0.5 xl:px-4 xl:py-0">
    <header class="flex justify-between {{if this.expand "max-md:mb-1"}}">
      <button class="w-12 md:hidden" type="button" {{on "click" (toggle "expand" this)}}>
        <FaIcon @icon={{if this.expand "chevron-up" "bars"}} @rotation={{if this.expand 180 0}} @prefix="fas" @size="2x" />
      </button>
      <LinkTo @route="index" class="mr-1 grid place-items-center transition-[margin] md:grid-cols-2 lg:mr-2">
        <TimedClock class="p-1" />
        <div class="leading-4 transition-all max-md:hidden lg:ml-1 lg:text-[1.075rem]">
          Timed
          <div class="text-2xs text-foreground-muted font-mono font-normal">
            v{{config.version}}
          </div>
        </div>
      </LinkTo>
    </header>
    <section class="w-full md:flex md:max-h-full md:w-auto md:flex-grow md:flex-row
        {{if this.expand "max-md:block max-md:h-full max-md:max-h-96 max-md:overflow-y-auto" "max-h-0 overflow-hidden"}}">
      <List>
        <ListItem class="max-md:w-full">
          <LinkTo0 @route="index" @onClick={{fn (mut this.expand) false}}>
            <FaIcon @icon="clock" @size="lg" />
            <span>Tracking</span>
          </LinkTo0>
        </ListItem>
        {{#if (can "access page")}}
          <ListItem class="max-md:hidden">
            <LinkTo0 @route="analysis">
              <FaIcon @icon="magnifying-glass" @prefix="fas" />
              Analysis
            </LinkTo0>
          </ListItem>
          <ListItem>
            <LinkTo0 @route="statistics" @onClick={{fn (mut this.expand) false}}>
              <FaIcon @icon="chart-bar" />
              Statistics
            </LinkTo0>
          </ListItem>
          <ListItem>
            <LinkTo0 @route="projects" @onClick={{fn (mut this.expand) false}}>
              <FaIcon @icon="briefcase" @prefix="fas" />
              Projects
            </LinkTo0>
          </ListItem>
        {{/if}}
        {{#if this.currentUser.user.isSuperuser}}
          <ListItem>
            <LinkTo0 @onClick={{fn (mut this.expand) false}} @route="users.index">
              <FaIcon @icon="users" @prefix="fas" />
              Users
            </LinkTo0>
          </ListItem>
        {{/if}}
      </List>
      <List class="md:ml-auto md:border-t-0">
        <ReportReviewWarning @class="max-md:hidden" />
        <ListItem>
          <LinkTo0 @onClick={{fn (mut this.expand) false}} title="Open Timed documentation for current page" href={{this.docs.endpoint}} target="_blank" data-test-docs-link>
            <FaIcon @icon="circle-question" @prefix="fa" />
          </LinkTo0>
        </ListItem>
        <ListItem>
          <LinkTo0 @onClick={{fn (mut this.expand) false}} @route="users.edit" @model={{this.currentUser.user.id}}>
            <FaIcon @icon="user" />
            {{this.currentUser.user.fullName}}
          </LinkTo0>
        </ListItem>
        <ListItem>
          <LinkTo0 href="#" data-test-logout {{on "click" (optional @onLogout)}}>
            <FaIcon @icon="power-off" @prefix="fas" />
            Logout
          </LinkTo0>
        </ListItem>
      </List>
    </section>
  </nav>
</div></template>}
