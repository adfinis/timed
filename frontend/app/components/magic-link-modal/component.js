import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class MagicLinkModal extends Component {
  @tracked customer;
  @tracked project;
  @tracked task;
  @tracked duration;
  @tracked comment;
  @tracked review;
  @tracked notBillable;
  @tracked statusMsg;
  @tracked errorMsg;

  @service router;

  get magicLinkString() {
    const url = this.router.urlFor("index.reports", {
      queryParams: {
        task: this.task?.id,
        project: this.task ? null : this.project?.id,
        customer: this.task ? null : this.project ? null : this.customer?.id,
        comment: this.comment,
        duration: this.duration,
        review: this.review,
        notBillable: this.notBillable,
      },
    });

    return `${window.location.origin}${url}`;
  }

  @action
  copyToClipboard() {
    try {
      navigator.clipboard.writeText(this.magicLinkString);
      this.statusMsg =
        "Magic link copied to clipboard. You can now send it to a friendly coworker!";
    } catch {
      /* istanbul ignore next */
      this.errorMsg = "Could not copy to clipboard";
    }
  }
}
