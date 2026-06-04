import Component from "@glimmer/component";

export default class Checkmark extends Component {
  get icon() {
    return this.args.checked ? "check-square" : "square";
  }
}
