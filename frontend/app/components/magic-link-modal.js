import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class MagicLinkModal extends Component {
  @tracked task;
  @tracked duration;
  @tracked comment;
  @tracked review;
  @tracked notBillable;
  @tracked statusMsg;
  @tracked errorMsg;

  @service router;
  @service notify;

  constructor(...args) {
    super(...args);
    this.task = this.args.task ?? null;
    this.duration = this.args.duration ?? null;
    this.comment = this.args.comment ?? "";
    this.review = this.args.review ?? false;
    this.notBillable = this.args.notBillable ?? false;
  }

  @action
  onSetTask(task) {
    this.task = task;
  }

  get magicLinkString() {
    const url = this.router.urlFor("index.reports", {
      queryParams: {
        task: this.task?.id,
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
      this.notify.success(
        "Magic link copied to clipboard.\nYou can now send it to a friendly coworker!",
      );
    } catch {
      this.notify.error("Could not copy to clipboard");
    }
  }
}
