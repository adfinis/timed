import { visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

import config from "timed/config/environment";

module("Acceptance | docs", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { tourDone: true });

    await authenticateSession({ user_id: user.id });
  });

  test("Each route render link to the documentation of the open page", async function (assert) {
    await visit("/");
    assert.dom("[data-test-docs-link]").exists();

    assert.strictEqual(
      document.querySelector("[data-test-docs-link]").href,
      `${config.docsBaseUrl}tracking/activities`,
    );

    await visit("/analysis");

    assert.strictEqual(
      document.querySelector("[data-test-docs-link]").href,
      `${config.docsBaseUrl}analysis`,
    );
  });
});
