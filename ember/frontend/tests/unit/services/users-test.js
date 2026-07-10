import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import { setupMirage } from "timed/tests/helpers/mirage";

module("Unit | Service | users", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("it works", async function (assert) {
    let requests = 0;
    this.server.createList("user", 2);
    this.server.get("/users", function ({ users }) {
      requests++;
      return users.all();
    });

    const service = this.owner.lookup("service:users");

    await service.load();
    assert.strictEqual(requests, 1);
    await service.load(); // users are already fetched, or currently being fetched
    assert.strictEqual(requests, 1);

    assert.strictEqual(service.data.length, 2);

    await service.reload();
    assert.strictEqual(requests, 2); // reloading always fetches
  });
});
