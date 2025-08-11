import { click, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

import { setBreakpoint } from "timed/tests/helpers/responsive";

module("Acceptance | index attendances", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    setBreakpoint("xl");

    const user = this.server.create("user");

    await authenticateSession({ user_id: user.id });

    this.server.create("attendance", "morning", { userId: user.id });
    this.server.create("attendance", "afternoon", { userId: user.id });
  });

  test("can visit /attendances", async function (assert) {
    await visit("/attendances");

    assert.strictEqual(currentURL(), "/attendances");
  });

  test("can list attendances", async function (assert) {
    await visit("/attendances");
    assert.dom("[data-test-attendance-slider-desktop]").exists({ count: 2 });
    assert.dom("[data-test-attendance-slider-mobile]").exists({ count: 2 });
    assert.dom("[data-test-attendance-slider]").exists({ count: 4 });
  });

  test("can save an attendances", async function (assert) {
    await visit("/attendances");

    assert.dom("[data-test-attendance-slider-desktop]").exists({ count: 2 });
    assert.dom("[data-test-attendance-slider-mobile]").exists({ count: 2 });
    assert.dom("[data-test-attendance-slider]").exists({ count: 4 });

    await click('[data-test-attendance-slider-id="1"] .noUi-draggable');

    assert.dom("[data-test-attendance-slider-desktop]").exists({ count: 2 });
    assert.dom("[data-test-attendance-slider-mobile]").exists({ count: 2 });
    assert.dom("[data-test-attendance-slider]").exists({ count: 4 });
  });

  test("can add an attendance", async function (assert) {
    await visit("/attendances");

    await click("[data-test-add-attendance]");

    assert.dom("[data-test-attendance-slider-desktop]").exists({ count: 3 });
    assert.dom("[data-test-attendance-slider-mobile]").exists({ count: 3 });
    assert.dom("[data-test-attendance-slider]").exists({ count: 6 });
  });

  test("can delete an attendance", async function (assert) {
    await visit("/attendances");

    await click(
      '[data-test-attendance-slider-id="1"] [data-test-delete-attendance]',
    );

    assert.dom('[data-test-attendance-slider-id="1"]').doesNotExist();

    assert.dom("[data-test-attendance-slider-desktop]").exists({ count: 1 });
    assert.dom("[data-test-attendance-slider-mobile]").exists({ count: 1 });
    assert.dom("[data-test-attendance-slider]").exists({ count: 2 });
  });
});
