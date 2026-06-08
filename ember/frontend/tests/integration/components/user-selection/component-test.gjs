import { fn } from "@ember/helper";
import { find, render } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import UserSelection from "timed/components/user-selection";

module("Integration | Component | user selection", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    assert.expect(1);
    const user = this.server.create("user");
    this.set("user", user);

    await render(
      <template>
        <UserSelection
          @user={{this.user}}
          @onChange={{fn (mut this.user)}}
          as |u|
        >
          {{u.user}}
        </UserSelection>
      </template>,
    );

    assert.strictEqual(
      find(".user-select .ember-power-select-selected-item").textContent.trim(),
      user.longName,
    );
  });
});
