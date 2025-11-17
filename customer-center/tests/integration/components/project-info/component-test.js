import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | project-info", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, "en");

  test("it renders", async function (assert) {
    const duration = 1;
    const expectedFormattedDuration = "00:01";

    this.project = {
      name: "Project #1",
      customer: {
        name: "Customer #1",
      },
      billingType: {
        name: "Billing type #1",
      },
      totalTime: moment.duration({ minutes: duration }),
      unconfirmedTime: moment.duration({ minutes: duration }),
    };

    await render(hbs`<ProjectInfo @project={{this.project}} />`);

    assert.dom(".project-info__item").exists({ count: 5 });

    assert
      .dom(".project-info__item:nth-child(1) span")
      .hasText(this.project.name);
    assert
      .dom(".project-info__item:nth-child(2) span")
      .hasText(this.project.customer.name);
    assert
      .dom(".project-info__item:nth-child(3) span")
      .hasText(this.project.billingType.name);

    assert
      .dom(".project-info__item:nth-child(4) span")
      .hasText(expectedFormattedDuration);
    assert
      .dom(".project-info__item:nth-child(5) span")
      .hasText(expectedFormattedDuration);
  });
});
