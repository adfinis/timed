import Component from "@glimmer/component";

export default class SyModal extends Component {
  get syModals() {
    return document.getElementById("sy-modals");
  }
}
