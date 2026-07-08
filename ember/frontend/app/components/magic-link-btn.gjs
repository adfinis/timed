import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";

import MagicLinkModal from "timed/components/magic-link-modal";

export default class MagicLinkBtn extends Component {
  @tracked isModalVisible = false;
  <template>
    <button
      type="button"
      data-test-magic-link-btn
      title="Create a magic link"
      class="btn btn-default"
      {{on "click" (toggle "isModalVisible" this)}}
      ...attributes
    >
      <FaIcon @icon="wand-magic-sparkles" @prefix="fas" @size="sm" />
      {{#if this.isModalVisible}}
        <MagicLinkModal
          @isVisible={{this.isModalVisible}}
          @onClose={{toggle "isModalVisible" this}}
        />
      {{/if}}
    </button>
  </template>
}
