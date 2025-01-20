import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class Topnav extends Component {
  @service currentUser;

  @service media;

  @service docs;

  @tracked expand = false;

  get navMobile() {
    return !this.media.isSm;
  }
}
