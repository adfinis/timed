import Helper from "@ember/component/helper";
import { service } from "@ember/service";

export default class Media extends Helper {
  @service media;

  constructor(...args) {
    super(...args);
    this.media.on("mediaChanged", () => this.recompute());
  }

  compute = ([prop]) => this.media[prop];
}
