import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import pick from "@nullvoxpopuli/ember-composable-helpers/helpers/pick";
import toggle from "@nullvoxpopuli/ember-composable-helpers/helpers/toggle";
import not from "ember-truth-helpers/helpers/not";

import DurationpickerDay from "timed/components/durationpicker-day";
import Modal from "timed/components/modal";
import TaskSelection from "timed/components/task-selection";
import Toggle from "timed/components/toggle";

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
  <template>
    <Modal
      @visible={{@isVisible}}
      @onClose={{@onClose}}
      data-test-magic-link-modal
      class="md:w-auto"
      as |modal|
    >
      <div class="magic-link-modal sm:min-w-[32rem]" data-test-magic-link-form>
        <modal.header>
          <h3>Create a magic link</h3>
        </modal.header>
        <modal.body class="grid gap-2" data-test-task-selector>
          <TaskSelection
            @disabled={{false}}
            @task={{this.task}}
            @on-set-task={{this.onSetTask}}
            as |t|
          >
            <t.customer @dropdownClass="z-[60]" />
            <t.project @dropdownClass="z-[60]" />
            <t.task @dropdownClass="z-[60]" />
          </TaskSelection>

          <input
            value={{this.comment}}
            type="text"
            {{on "change" (pick "target.value" (fn (mut this.comment)))}}
            class="ember-text-field form-control rounded"
            placeholder="Comment"
            aria-label="Comment for the timed entry"
            data-test-magic-link-comment
          />

          <div class="flex">
            <DurationpickerDay
              @disabled={{false}}
              @value={{this.duration}}
              @onChange={{fn (mut this.duration)}}
              @title="Task duration"
              data-test-magic-link-duration
              class="flex-grow"
            />
            <Toggle
              class="margin-small-right form-control flex-shrink"
              data-test-magic-link-review
              @hint="Needs review"
              @onToggle={{toggle "review" this}}
              @value={{this.review}}
            >
              <span class="fa-layers fa-fw">
                <FaIcon @icon="user" />
                <FaIcon
                  @icon="question"
                  @prefix="fas"
                  @transform="shrink-6 up-7 right-8"
                />
              </span>
            </Toggle>
            <Toggle
              class="form-control flex-shrink"
              data-test-magic-link-not-billable
              @hint="Not billable"
              @onToggle={{toggle "notBillable" this}}
              @value={{this.notBillable}}
            >
              <span class="fa-layers fa-fw">
                <FaIcon @icon="dollar-sign" @prefix="fas" />
                <FaIcon @icon="slash" @prefix="fas" />
              </span>
            </Toggle>
          </div>

          <input
            value={{this.magicLinkString}}
            disabled={{true}}
            type="url"
            class="form-control mt-2 flex-grow rounded"
            aria-label="magic link string"
            data-test-magic-link-string
          />
        </modal.body>
        <modal.footer class="flex justify-end">
          <button
            class="btn btn-primary"
            {{on "click" this.copyToClipboard}}
            disabled={{not this.task}}
            type="button"
            data-test-create-magic-link-btn
          >
            Copy to clippy
          </button>
        </modal.footer>
      </div>
    </Modal>
  </template>
}
