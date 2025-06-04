import { getOwner } from "@ember/application";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import { OVERTIME_FEEDBACK_KEY } from "timed/components/timed-clock";

module("Integration | Component | timed clock", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    localStorage.setItem(OVERTIME_FEEDBACK_KEY, true);

    this.value = 10;
    const currentUser = getOwner(this).lookup("service:current-user");
    currentUser.worktimeBalance = {
      perform: () => {},
      lastSuccessful: {
        value: this.value,
      },
    };

    await render(hbs`<TimedClock />`);

    assert
      .dom("[data-test-timed-clock]>defs>radialGradient>stop:last-child")
      .hasAttribute("stop-opacity", "0.5");
  });
});
