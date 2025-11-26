import Component from "@glimmer/component";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import NotifyService from "ember-notify";
import pageTitle from "ember-page-title/helpers/page-title";

// TODO: clean this mess up
const BTNS = [
  "btn-primary",
  "btn-default",
  "btn-danger",
  "btn-warning",
  "btn-success",
] as const;
const FN_KEYS = ["info", "info", "error", "warning", "success"] as const;

const BTN_FN_MAP: Record<(typeof BTNS)[number], (typeof FN_KEYS)[number]> =
  BTNS.reduce(
    (acc, k, i) => ({ ...acc, [k]: FN_KEYS[i] }),
    {},
  ) as typeof BTN_FN_MAP;

const stripPrefix = (s: string) => s.replace(/^btn-/, "");

export default class ButtonTemplate extends Component {
  @service declare notify: NotifyService;

  @action
  alert(btnClass: (typeof BTNS)[number]) {
    if (btnClass == "btn-default") {
      this.notify.info("same as for btn-primary");
      return;
    }
    this.notify[BTN_FN_MAP[btnClass]]("hello world");
  }

  <template>
    {{pageTitle "Button"}}
    <h1>Button</h1>

    <div class="flex gap-2 place-self-center">
      {{#each BTNS as |btnClass|}}
        <button
          {{on "click" (fn this.alert btnClass)}}
          class="btn {{btnClass}} capitalize"
          type="button"
        >
          {{stripPrefix btnClass}}
          Button
        </button>
        <div></div>
      {{/each}}
    </div>
  </template>
}
