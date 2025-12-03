/* eslint-disable ember/no-private-routing-service */
import type RouterService from "@ember/routing/router-service";
import Component from "@glimmer/component";
import { service } from "@ember/service";
import { LinkTo } from "@ember/routing";
import PageHeading from "../components/page-heading";

export default class IndexTemplate extends Component {
  @service declare router: RouterService;

  get componentPages() {
    // NOTE: this is a very ugly hack, but its okay here because its a dummy application
    return Object.keys(
      (
        this.router._router._routerMicrolib.recognizer as unknown as {
          names: Record<string, unknown>;
        }
      ).names,
    ).filter(
      (k) =>
        !(k.includes(".") || k.includes("_loading") || k.includes("_error")) &&
        !["error", "loading", "index", "application"].includes(k),
    );
  }

  <template>
    <PageHeading>Available Components</PageHeading>
    <ul>
      {{#each this.componentPages as |cp|}}
        <li><LinkTo @route={{cp}}>{{cp}}</LinkTo></li>
      {{/each}}
    </ul>
  </template>
}
