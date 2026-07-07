import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { authenticateSession } from "ember-simple-auth/test-support";
import { DateTime, Duration } from "luxon";
import { module, test } from "qunit";
import { dateToString } from "ui-core/utils/date";

import { setupApplicationTest } from "timed/tests/helpers";
import {
  OVERTIME_MAX_CREDIT,
  OVERTIME_MIN_CREDIT,
} from "timed/users/edit/credits/overtime-credits/edit/template";
import humanizeDuration from "timed/utils/humanize-duration";

module("Acceptance | users edit credits overtime credit", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.user = this.server.create("user", { isSuperuser: true });

    await authenticateSession({ user_id: this.user.id });
  });

  test("can create an overtime credit", async function (assert) {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`);

    await fillIn("input[name=date]", dateToString(DateTime.now()));
    await fillIn("input[name=duration]", "20:00");
    await fillIn("input[name=comment]", "Comment");

    await click("[data-test-overtime-credit-save]");

    assert.strictEqual(currentURL(), `/users/${this.user.id}/credits`);

    assert.dom("[data-test-overtime-credits] tbody > tr").exists({ count: 1 });
  });

  test("can edit an overtime credit", async function (assert) {
    const { id } = this.server.create("overtime-credit", { user: this.user });

    await visit(`/users/${this.user.id}/credits`);

    await click("[data-test-overtime-credits] tbody > tr:first-child");

    assert.strictEqual(
      currentURL(),
      `/users/${this.user.id}/credits/overtime-credits/${id}`,
    );

    await fillIn("input[name=date]", dateToString(DateTime.now()));
    await fillIn("input[name=duration]", "20:00");
    await fillIn("input[name=comment]", "Ding dong");

    await click("[data-test-overtime-credit-save]");

    assert.strictEqual(currentURL(), `/users/${this.user.id}/credits`);

    assert.dom("[data-test-overtime-credits] tbody > tr").exists({ count: 1 });

    assert
      .dom(
        "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(1)",
      )
      .hasText(dateToString(DateTime.now()));

    assert
      .dom(
        "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(2)",
      )
      .hasText("20h 0m");

    assert
      .dom(
        "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(3)",
      )
      .hasText("Ding dong");
  });

  test("can delete an overtime credit", async function (assert) {
    const { id } = this.server.create("overtime-credit", { user: this.user });

    await visit(`/users/${this.user.id}/credits/overtime-credits/${id}`);

    await click("[data-test-overtime-credit-delete]");

    assert.strictEqual(currentURL(), `/users/${this.user.id}/credits`);

    assert.dom("[data-test-overtime-credits] tr").doesNotExist();
  });

  test("redirects to the year of the created overtime credit", async function (assert) {
    await visit(`/users/${this.user.id}/credits/overtime-credits/new`);

    await fillIn(
      "input[name=date]",
      dateToString(DateTime.now().plus({ years: 1 })),
    );
    await fillIn("input[name=duration]", "20:00");
    await fillIn("input[name=comment]", "Ding dong");

    await click("[data-test-overtime-credit-save]");

    assert.strictEqual(
      currentURL(),
      `/users/${this.user.id}/credits?year=${DateTime.now().year + 1}`,
    );
  });

  test("can use shorthands for overtime credit & values get clamped", async function (assert) {
    const { id } = this.server.create("overtime-credit", { user: this.user });

    await visit(`/users/${this.user.id}/credits`);
    const inputDuration = async (durationString) => {
      await click("[data-test-overtime-credits] tbody > tr:first-child");

      assert.strictEqual(
        currentURL(),
        `/users/${this.user.id}/credits/overtime-credits/${id}`,
      );

      await fillIn("input[name=date]", dateToString(DateTime.now()));
      await fillIn("input[name=duration]", durationString);

      await click("[data-test-overtime-credit-save]");

      assert.strictEqual(currentURL(), `/users/${this.user.id}/credits`);
    };

    const assertDurationText = (text) =>
      assert
        .dom(
          "[data-test-overtime-credits] tbody > tr:first-child > td:nth-child(2)",
        )
        .hasText(text);

    await inputDuration("1300");
    assertDurationText(humanizeDuration(Duration.fromObject({ hours: 13 })));

    await inputDuration("123456789");
    assertDurationText(humanizeDuration(OVERTIME_MAX_CREDIT));

    await inputDuration("-10:20");
    assertDurationText(humanizeDuration(OVERTIME_MIN_CREDIT));
  });
});
