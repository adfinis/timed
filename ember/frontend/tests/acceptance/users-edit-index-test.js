import { currentURL, visit } from "@ember/test-helpers";
import { authenticateSession } from "ember-simple-auth/test-support";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { setupApplicationTest } from "timed/tests/helpers";

module("Acceptance | users edit index", function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user");
    this.user = user;
    await authenticateSession({ user_id: user.id });
  });

  test("it renders", async function (assert) {
    await visit(`/users/${this.user.id}`);
    assert.ok(currentURL().includes(this.user.id));
    assert.dom("[data-test-general-information]").exists();
    assert.dom("[data-test-employments]").exists();
    assert.dom("[data-test-absences]").exists();
  });

  test("only shows absences of the current year", async function (assert) {
    const absenceType = this.server.create("absence-type");

    const N = 5;

    await this.server.createList("absence", N, {
      userId: this.user.id,
      absenceType,
    });

    await this.server.createList("absence", 5, {
      userId: this.user.id,
      absenceType,
      date: DateTime.now().minus({ years: 10 }),
    });

    await visit(`/users/${this.user.id}`);
    assert.dom("[data-test-absences]").exists();
    assert.dom("[data-test-absences] tbody tr").exists({ count: N });
  });
});
