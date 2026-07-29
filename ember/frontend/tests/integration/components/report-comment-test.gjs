import { fn } from "@ember/helper";
import {
  render,
  fillIn,
  typeIn,
  click,
  find,
  triggerEvent,
  triggerKeyEvent,
} from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ReportComment from "timed/components/report-comment";
import { setupMirage } from "timed/tests/helpers/mirage";

module("Integration | Component | ReportComment", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("basic functionality works", async function (assert) {
    class State {
      @tracked comment = "";
    }

    const state = new State();

    await render(
      <template>
        <ReportComment
          data-test-report-comment
          @value={{state.comment}}
          @onChange={{fn (mut state.comment)}}
        />
      </template>,
    );

    assert.dom("[data-test-report-comment]").exists();
    assert.dom("[data-test-report-comment]").hasNoValue();

    await fillIn("[data-test-report-comment]", "foo");
    assert.strictEqual(state.comment, "foo");
  });

  test("it completes users via click, enter & tab", async function (assert) {
    const user = this.server.create("user", { username: "a".repeat(10) });
    this.owner.lookup("service:users").load();

    class State {
      @tracked comment = "";
    }

    const state = new State();

    await render(
      <template>
        <ReportComment
          data-test-report-comment
          @value={{state.comment}}
          @onChange={{fn (mut state.comment)}}
        />
      </template>,
    );

    assert.dom("[data-test-report-comment]").exists();
    assert.dom("[data-test-report-comment]").hasNoValue();

    await typeIn("[data-test-report-comment]", "@a");

    const assertAutocomplete = async (action, actionDesc) => {
      // clear input
      await fillIn("[data-test-report-comment]", "");
      assert.dom("[data-test-report-comment]").hasNoValue();

      // setup completion
      await typeIn("[data-test-report-comment]", "@a");
      assert.dom("[data-test-report-comment-user-dropdown]").exists();

      assert
        .dom("[data-test-report-comment-user-dropdown] li")
        .hasText(`@${user.username}`);

      await action();

      assert
        .dom("[data-test-report-comment]")
        .hasValue(`${user.fullName} `, actionDesc);
    };

    await assertAutocomplete(
      () => click("[data-test-report-comment-user-dropdown] li"),
      "clicking a suggestion completes it",
    );
    await assertAutocomplete(
      () => triggerKeyEvent("[data-test-report-comment]", "keydown", "Enter"),
      "enter completes",
    );
    await assertAutocomplete(
      () => triggerKeyEvent("[data-test-report-comment]", "keydown", "Tab"),
      "tab completes",
    );
  });

  test("user suggestions can be navigated with arrow keys", async function (assert) {
    ["user1", "user2"].forEach((username) =>
      this.server.create("user", { username }),
    );
    this.owner.lookup("service:users").load();

    class State {
      @tracked comment = "";
    }

    const state = new State();

    await render(
      <template>
        <ReportComment
          data-test-report-comment
          @value={{state.comment}}
          @onChange={{fn (mut state.comment)}}
        />
      </template>,
    );

    assert.dom("[data-test-report-comment]").exists();
    assert.dom("[data-test-report-comment]").hasNoValue();

    await typeIn("[data-test-report-comment]", "@user");

    assert
      .dom("[data-test-report-comment-user-dropdown] li")
      .exists({ count: 2 });

    assert
      .dom("[data-test-report-comment-user-dropdown] li:first-child")
      .hasAria("current")
      .containsText("user1");

    assert
      .dom("[data-test-report-comment-user-dropdown] li:last-child")
      .doesNotHaveAria("current")
      .containsText("user2");

    const assertDropdownSelection = (first, last) => {
      first(
        assert.dom("[data-test-report-comment-user-dropdown] li:first-child"),
      );
      last(
        assert.dom("[data-test-report-comment-user-dropdown] li:last-child"),
      );
    };

    const assertFirstIsCurrent = () =>
      assertDropdownSelection(
        (e) => e.hasAria("current"),
        (e) => e.doesNotHaveAria("current"),
      );
    const assertLastIsCurrent = () =>
      assertDropdownSelection(
        (e) => e.doesNotHaveAria("current"),
        (e) => e.hasAria("current"),
      );

    assertFirstIsCurrent();

    // arrow down -> next user
    await triggerKeyEvent("[data-test-report-comment]", "keydown", "ArrowDown");

    assertLastIsCurrent();

    // arrow down -> next user, wraparound if it was the last one
    await triggerKeyEvent("[data-test-report-comment]", "keydown", "ArrowDown");

    assertFirstIsCurrent();

    // arrow up -> next user, wraparound if it was the first one
    await triggerKeyEvent("[data-test-report-comment]", "keydown", "ArrowUp");

    assertLastIsCurrent();

    await triggerKeyEvent("[data-test-report-comment]", "keydown", "ArrowUp");

    assertFirstIsCurrent();
  });

  test("it places the cursor after a completed mention", async function (assert) {
    this.server.create("user", { username: "user" });
    this.owner.lookup("service:users").load();

    class State {
      @tracked comment = "";
    }

    const state = new State();

    await render(
      <template>
        <ReportComment
          data-test-report-comment
          @value={{state.comment}}
          @onChange={{fn (mut state.comment)}}
        />
      </template>,
    );

    await fillIn("[data-test-report-comment]", "foo bar @u baz");

    const input = find("[data-test-report-comment]");

    input.setSelectionRange("foo bar @u".length, "foo bar @u".length);

    await triggerEvent("[data-test-report-comment]", "input");
    await triggerKeyEvent("[data-test-report-comment]", "keydown", "Enter");

    assert.strictEqual(" baz", state.comment.slice(input.selectionStart));
  });
});
