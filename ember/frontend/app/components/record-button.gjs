import { on } from "@ember/modifier";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
import Component from "@glimmer/component";
import optional from "@nullvoxpopuli/ember-composable-helpers/helpers/optional";
import preventDefault from "ember-event-helpers/helpers/prevent-default";
import { not } from "ember-truth-helpers";

import DurationSince from "timed/components/duration-since";

export default class RecordButton extends Component {
  get active() {
    return this.args.recording && this.args.activity?.id;
  }
  <template>
    <button
      type="submit"
      data-test-record-stop={{not (not this.active)}}
      data-test-record-start={{not this.active}}
      class="record-button-container btn text-foreground-accent h-full px-3 text-sm
        {{if
          this.active
          'record-button-container--recording active grid grid-cols-[auto,minmax(0,1fr)] place-items-center gap-x-2'
        }}"
      {{on
        "click"
        (preventDefault (optional (if this.active @onStop @onStart)))
      }}
    >
      {{#if this.active}}
        <FaIcon @icon="square" @prefix="fas" class="text-danger" />
        <div class="record-button-timer">
          <DurationSince @from={{@activity.from}} />
        </div>
      {{else}}
        <FaIcon
          @icon="play"
          @prefix="fas"
          @transform="right-1"
          class="text-success"
        />
      {{/if}}
    </button>
  </template>
}
