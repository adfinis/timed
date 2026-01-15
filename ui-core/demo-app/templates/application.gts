import pageTitle from "ember-page-title/helpers/page-title";
import Component from "@glimmer/component";
import type AppearanceService from "#src/services/appearance.ts";
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

    <div class="mt-16" />
    <main class="p-2 grid">
      {{outlet}}
    </main>
  </template>
}
