import Component from "@glimmer/component";

export default class Modal extends Component {
  get target() {
    return document.getElementById("modals");
  }

  get dropdownDestination() {
    return document.getElementById("ember-basic-dropdown-wormhole");
  }
}
