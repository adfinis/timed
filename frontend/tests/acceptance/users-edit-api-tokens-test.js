import { click, fillIn, currentURL, visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

module("Acceptance | users edit api tokens", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.user = this.server.create("user");

    await authenticateSession({ user_id: this.user.id });
  });

  test("can list own api tokens", async function (assert) {
    this.server.createList("api-token", 3);

    await visit(`/users/${this.user.id}/api-tokens`);

    assert.dom("[data-test-api-tokens] tbody tr").exists({ count: 3 });
  });

  test("can create api token and see the raw token once", async function (assert) {
    await visit(`/users/${this.user.id}/api-tokens/new`);

    await fillIn("input[name=name]", "automation script");
    await click("[data-test-api-token-save]");

    assert.dom("[data-test-api-token-created]").exists();
    assert.dom("[data-test-api-token-value]").hasValue("raw-test-token");
  });

  test("can delete api token", async function (assert) {
    this.server.create("api-token");

    await visit(`/users/${this.user.id}/api-tokens`);

    await click("[data-test-api-token-delete]");

    assert.dom("[data-test-api-tokens] tbody tr").doesNotExist();
  });

  test("can not visit api tokens of other users", async function (assert) {
    const other = this.server.create("user");

    await visit(`/users/${other.id}/api-tokens`);

    assert.strictEqual(currentURL(), `/users/${other.id}`);
  });
});
