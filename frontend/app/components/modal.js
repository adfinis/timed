import Component from "@glimmer/component";

export default class Modal extends Component {
  get syModals() {
    return document.getElementById("sy-modals");
  }
}
