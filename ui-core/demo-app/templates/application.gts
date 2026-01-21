import pageTitle from "ember-page-title/helpers/page-title";
import Component from "@glimmer/component";
import type AppearanceService from "#src/services/appearance.ts";
import { service } from "@ember/service";
import { keyResponder, onKey } from "ember-keyboard";
import { runTask } from "ember-lifeline";
import Topnav from "#src/components/topnav.gts";
import { LinkTo } from "@ember/routing";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import {
  faChartBar,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

export const HEADER_ID = "header";
export const MAIN_ID = "main";

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

  constructor(...args: ConstructorParameters<typeof Component>) {
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

    <div class="flex flex-col h-screen">
      <div id="modals" class="[&>*]:overflow-x-hidden" />
      <Topnav as |t|>
        <t.header class="mr-2 grid place-self-center">
          <LinkTo
            @route="index"
            class="text-3xl flex text-center items-center gap-2"
          >
            <img alt="adfinis" src="/logo.png" class="h-[1em]" />
            <h1 class="text-primary-light">ui-core</h1>
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
              <t.link @route="analysis">
                <FaIcon class="text-lg" @icon={{faMagnifyingGlass}} />
                Analysis
              </t.link>
            </l.item>
            <l.item>
              <t.link @route="statistics">
                <FaIcon class="text-lg" @icon={{faChartBar}} />Statistics
              </t.link>
            </l.item>
          </t.list>
        </t.nav>
      </Topnav>
      <div class="p-2 pb-0" id={{HEADER_ID}}>
      </div>
      <main class="px-2 flex-1 min-h-0 overflow-y-auto" id={{MAIN_ID}}>
      </main>
      <div class="p-2 pt-0">
        {{outlet}}
      </div>
    </div>
  </template>
}
