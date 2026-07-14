import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { runTask } from "ember-lifeline";
import { modifier } from "ember-modifier";

const eq = (a, b) => a === b;
const and = (a, b) => a && b;

const mod = (n, m) => ((n % m) + m) % m;

const MENTION_REGEX = /@(?<username>\w*)$/;

const elementModifier = modifier((element, [context]) => {
  context.inputElement = element;
});

export default class ReportCommentInput extends Component {
  @service users;

  @tracked showDropdown = false;
  @tracked searchQuery = "";
  @tracked activeIndex = 0;

  inputElement = null;

  constructor(...args) {
    super(...args);

    // ensure users get fetched/loaded
    runTask(this, () => this.users.load(), 0);
  }

  get tooltip() {
    const parts = [];
    if (this.args.customerVisible) {
      parts.push("This project's comments are visible to the customer");
      parts.push("===================================================");
      parts.push("");
    }
    parts.push(this.args.value);
    return parts.join("\n");
  }

  get filteredUsers() {
    const query = this.searchQuery.toLowerCase();
    if (query.length < 1) return []; // only show users once there's at least one character
    const indexOfQuery = (s) => s.indexOf(query);
    return this.users.data
      .filter((user) => user.username.toLowerCase().includes(query))
      .toSorted((a, b) => indexOfQuery(a.username) - indexOfQuery(b.username));
  }

  @action
  cycleUser(a) {
    this.activeIndex = mod(this.activeIndex + a, this.filteredUsers.length);
  }

  @action
  selectActiveUser() {
    this.selectUser(this.filteredUsers[this.activeIndex]);
  }

  @action
  selectUser(user) {
    if (!this.inputElement) return;

    const { value, selectionStart } = this.inputElement;

    const textBeforeCursor = value.slice(0, selectionStart);
    const textAfterCursor = value.slice(selectionStart);

    const newTextBeforeCursor = textBeforeCursor.replace(
      MENTION_REGEX,
      `${user.fullName} `,
    );
    const newValue = newTextBeforeCursor + textAfterCursor;

    this.showDropdown = false;
    this.args.onChange?.(newValue);

    this.inputElement.focus();

    setTimeout(() => {
      // place cursor after the text (instead of e.g. at the end of it)
      const newCursorPos = newTextBeforeCursor.length;
      this.inputElement.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  @action
  handleInput() {
    const { value, selectionStart } = this.inputElement;

    this.args.onChange?.(value);

    const textBeforeCursor = value.slice(0, selectionStart);
    const match = textBeforeCursor.match(MENTION_REGEX);

    this.showDropdown = !!match;

    if (match) {
      this.searchQuery = match[1]; // match[0] -> @<stuff>, match[1] -> <stuff>
      this.activeIndex = 0;
    }
  }

  @action
  handleKeydown(e) {
    const listLength = this.filteredUsers.length;
    if (!(this.showDropdown && listLength)) return;

    const keyMap = {
      Escape: () => {
        this.showDropdown = false;
      },
      ArrowUp: () => this.cycleUser(-1),
      ArrowDown: () => this.cycleUser(1),
      Enter: () => this.selectActiveUser(),
      Tab: () => this.selectActiveUser(),
    };

    const handler = keyMap[e.key];
    if (!handler) return;

    e.preventDefault();
    handler();
  }

  <template>
    <div class="relative w-full">
      <input
        ...attributes
        type="text"
        class="comment-field w-full rounded
          {{if @customerVisible 'customer-comment'}}"
        placeholder="Comment"
        name="comment"
        id="row-comment"
        value={{@value}}
        disabled={{@disabled}}
        title={{this.tooltip}}
        spellcheck="true"
        autocomplete="off"
        {{on "input" this.handleInput}}
        {{on "keydown" this.handleKeydown}}
        {{elementModifier this}}
        data-test-report-comment
      />
      {{#if (and this.showDropdown this.filteredUsers.length)}}
        <ul
          data-test-report-comment-user-dropdown
          class="bg-background text-foreground absolute left-0 top-full z-30 mt-1 max-h-48 min-w-64 overflow-y-auto border py-1"
          role="listbox"
        >
          {{#each this.filteredUsers as |user index|}}
            <li
              class="cursor-pointer px-2
                {{if
                  (eq this.activeIndex index)
                  'bg-primary-light text-foreground-primary'
                }}"
              role="option"
              aria-current={{eq this.activeIndex index}}
              aria-selected="false"
              {{on "mouseenter" (fn (mut this.activeIndex) index)}}
              {{on "click" (fn this.selectUser user)}}
            >
              {{! NOTE: we may want to highlight the search query (in the future), by like e.g. making it bold }}
              @{{user.username}}
            </li>
          {{/each}}
        </ul>
      {{/if}}
    </div>
  </template>
}
