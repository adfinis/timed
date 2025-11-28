import { LinkTo } from "@ember/routing";
import EmberNotify from "ember-notify/components/ember-notify";
import pageTitle from "ember-page-title/helpers/page-title";
import Topnav from "ui-core/components/topnav";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import {
  faChartBar,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Component from "@glimmer/component";
import type AppearanceService from "ui-core/services/appearance";
import { service } from "@ember/service";
import { keyResponder, onKey } from "ember-keyboard";
import { runTask } from "ember-lifeline";

@keyResponder
export default class Application extends Component {
  @service declare appearance: AppearanceService;

  @onKey("ctrl+,")
  _toggleColorScheme(e: KeyboardEvent) {
    e.preventDefault();
    this.appearance.toggleColorScheme();
  }

  @onKey("ctrl+.")
  _cycleTheme(e: KeyboardEvent) {
    e.preventDefault();
    this.appearance.cycleTheme();
  }

  constructor(...args) {
    super(...args);
    runTask(
      this,
      () => {
        this.appearance.loadConfiguration();
      },
      1,
    );
  }

  <template>
    {{pageTitle "ui-core"}}

    <EmberNotify @messageStyle="bootstrap" />
    <Topnav as |t|>
      <t.header class="mr-2 grid place-self-center">
        <LinkTo @route="index" class="grid">
          <h1 class="text-4xl py-1 text-primary-light">ui-core</h1>
        </LinkTo>
      </t.header>

      <t.nav>
        <t.list />

        <t.list class="ml-auto" as |l|>
          <l.item>
            <t.link @route="index">
              <FaIcon class="text-lg" @icon={{faClock}} />
              Tracking
            </t.link>
          </l.item>

          <l.item>
            <t.link @route="button">
              <FaIcon class="text-lg" @icon={{faMagnifyingGlass}} />
              Analysis
            </t.link>
          </l.item>
          <l.item>
            <t.link @route="table">
              <FaIcon class="text-lg" @icon={{faChartBar}} />Statistics
            </t.link>
          </l.item>
        </t.list>
      </t.nav>
    </Topnav>
    <div class="mt-14" />
    <main class="p-2 grid">
      {{outlet}}
    </main>
  </template>
}
