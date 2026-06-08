import { on } from "@ember/modifier";
import { action } from "@ember/object";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

import MagicLinkModal from "timed/components/magic-link-modal";

export default class MagicLinkBtn extends Component {
  @tracked isModalVisible = false;

  @action toggleModal(evt) {
    evt?.stopPropagation();
    this.isModalVisible = !this.isModalVisible;
  }

  @action closeModal(evt) {
    evt?.stopPropagation();
    this.isModalVisible = false;
  }

  <template>
    <button
      type="button"
      data-test-magic-link-btn
      title="Create a magic link"
      class="btn btn-default"
      {{on "click" this.toggleModal}}
      ...attributes
    >
      <FaIcon @icon="bolt" @prefix="fas" @size="sm" />
      {{#if this.isModalVisible}}
        <MagicLinkModal
          @isVisible={{this.isModalVisible}}
          @onClose={{this.closeModal}}
          @task={{@task}}
          @duration={{@duration}}
          @comment={{@comment}}
          @review={{@review}}
          @notBillable={{@notBillable}}
        />
      {{/if}}
    </button>
  </template>
}
