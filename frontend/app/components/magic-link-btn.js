import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class MagicLinkBtn extends Component {
  @tracked isModalVisible = false;

  @action
  toggleModal(event) {
    event?.stopPropagation();
    this.isModalVisible = !this.isModalVisible;
  }

  @action
  closeModal() {
    this.isModalVisible = false;
  }
}
