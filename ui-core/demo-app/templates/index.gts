import Component from "@glimmer/component";
import Layout from "../components/layout.gts";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { not } from "ember-truth-helpers";
import Modal from "#src/components/modal.gts";

const greeting = "hello";

export default class IndexTemplate extends Component {
  @tracked visible = false;

  yes = () => {
    this.visible = false;
    alert("whoa");
  };

  <template>
    <Layout>
      <:header>
        <h1>Welcome to ember!</h1>
      </:header>
      <:main>
        {{greeting}}, world!

        <button
          class="btn btn-primary"
          type="button"
          {{on "click" (fn (mut this.visible) (not this.visible))}}
        >open</button>

        <Modal
          @visible={{this.visible}}
          @onClose={{fn (mut this.visible) false}}
          class="sm:min-w-[32rem] md:w-auto"
          as |m|
        >
          <m.header><h3>Modal</h3></m.header>
          <m.body>body</m.body>
          <m.footer class="flex justify-between">
            <button
              class="btn btn-danger"
              type="button"
              {{on "click" (fn (mut this.visible) false)}}
            >
              cancel
            </button>

            <button
              class="btn btn-primary"
              type="button"
              {{on "click" this.yes}}
            >
              ship it
            </button>
          </m.footer>
        </Modal>
      </:main>

    </Layout>
  </template>
}
