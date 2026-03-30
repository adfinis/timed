import { registerDestructor } from "@ember/destroyable";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class FilterSidebar extends Component {
  @tracked visible = false;
  @tracked destination;
  @tracked report;
  @service history;

  onShow = (ev) => {
    this.visible = true;
    this.report = ev.detail.report;
  };

  onClose = () => {
    this.visible = false;
    this.report = null;
  };

  constructor(...args) {
    super(...args);
    this.destination = document.getElementById("report-history-sidebar-target");

    this.history.addEventListener("show", this.onShow);
    this.history.addEventListener("close", this.onClose);

    registerDestructor(this, () => {
      this.messaging.removeEventListener("show", this.onShow);
      this.messaging.removeEventListener("close", this.onClose);
    });
  }
}
