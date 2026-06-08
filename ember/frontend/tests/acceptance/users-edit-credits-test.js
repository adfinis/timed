import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { authenticateSession } from "ember-simple-auth/test-support";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { setupApplicationTest } from "timed/tests/helpers";

module("Acceptance | users edit credits", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.user = this.server.create("user", { isSuperuser: true });

    await authenticateSession({ user_id: this.user.id });
  });

  test("can visit /users/:id/credits", async function (assert) {
    await visit(`/users/1/credits`);

    assert.dom(".card").exists({ count: 2 });
  });

  test("can change year", async function (assert) {
    const {
      employments: {
        models: [activeEmployment],
      },
    } = this.user;

    await visit(`/users/1/credits`);

    assert
      .dom("select option:first-child")
      .hasText(activeEmployment.start.getFullYear().toString());

    assert
      .dom("select option:nth-last-child(2)")
      .hasText(DateTime.now().plus({ years: 1 }).year.toString());

    assert.dom("select option:last-child").hasText("All");

    await fillIn("select", DateTime.now().plus({ years: 1 }).year);

    assert.ok(
      currentURL().includes(`year=${DateTime.now().plus({ years: 1 }).year}`),
    );
  });

  test("can transfer", async function (assert) {
    await visit(`/users/1/credits?year=${DateTime.now().year - 1}`);

    await click(".year-select .btn");

    assert.strictEqual(currentURL(), "/users/1/credits");
  });
});
