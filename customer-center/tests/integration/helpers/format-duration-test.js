import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Helper | format-duration", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, "en");

  test("it renders", async function (assert) {
    const intl = this.owner.lookup("service:intl");
    const duration = 1;
    const durationString = intl.t("helper.format-duration.minutes", {
      count: duration,
    });

    this.duration = moment.duration({ minutes: duration });

    await render(hbs`{{format-duration this.duration}}`);

    assert.dom(this.element).hasText(durationString);
  });
});
