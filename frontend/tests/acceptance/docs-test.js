import { visit } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupApplicationTest } from "ember-qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { module, test } from "qunit";

import config from "timed/config/environment";
import { ROUTE_DOCS_MAPPING } from "timed/services/docs";

module("Acceptance | docs", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const user = this.server.create("user", { tourDone: true });

    await authenticateSession({ user_id: user.id });
  });

  test("Each route renders a link to the corresponding documentation page", async function (assert) {
    const routesKey = Object.keys(ROUTE_DOCS_MAPPING);
    const router = this.owner.lookup("service:router");

    for (const routeKey of routesKey) {
      if (routeKey === "users.edit.index") continue;
      // eslint-disable-next-line no-await-in-loop
      await visit(router.urlFor(routeKey));
      assert.dom("[data-test-docs-link]").exists();

      assert.strictEqual(
        document.querySelector("[data-test-docs-link]").href,
        `${config.docsBaseUrl}${ROUTE_DOCS_MAPPING[routeKey]}`,
      );
    }
  });
});
