import Component from "@glimmer/component";
import pageTitle from "ember-page-title/helpers/page-title";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { toggle } from "@nullvoxpopuli/ember-composable-helpers";
import Modal from "ui-core/components/modal";
import { action } from "@ember/object";
import NotifyService from "ember-notify";
import { service } from "@ember/service";
import PageHeading from "../components/page-heading";

export default class ModalTemplate extends Component {
  @service declare notify: NotifyService;

  @tracked visible = false;

  @action
  yes() {
    this.notify.info("shipped it");
    this.visible = false;
  }

  <template>
    {{pageTitle "Modal"}}

    <PageHeading>Modal</PageHeading>
    <div>
      <button
        class="btn btn-primary"
        type="button"
        {{on "click" (toggle "visible" this)}}
      >open</button>
      <Modal
        @visible={{this.visible}}
        @onClose={{toggle "visible" this}}
        class="sm:min-w-[32rem] md:w-auto"
        as |m|
      >
        <m.header><h3>Modal</h3></m.header>
        <m.body>body</m.body>
        <m.footer class="flex justify-between">
          <button
            class="btn btn-danger"
            type="button"
            {{on "click" (toggle "visible" this)}}
          >
            cancel
          </button>

          <button class="btn btn-primary" type="button" {{on "click" this.yes}}>
            ship it
          </button>
        </m.footer>
      </Modal>
    </div>
  </template>
}
