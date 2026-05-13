import Component from "@glimmer/component";

export default class Modal extends Component {
  get target() {
    return document.getElementById("modals");
  }
}
