import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import ReportRow from "timed/components/report-row";
import { fn } from "@ember/helper";

module("Integration | Component | report row", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("renders", async function (assert) {
    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() }),
    );

    await render(<template><ReportRow @report={{this.report}} /></template>);

    assert.dom("form").exists({ count: 1 });
    assert.dom(".form-group").exists({ count: 8 });
    assert.dom(".btn-danger").exists({ count: 1 });
    assert.dom(".btn-primary").exists({ count: 1 });
  });

  test("can delete row", async function (assert) {
    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() }),
    );
    this.set("didDelete", false);

    await render(
      <template><ReportRow @report={{this.report}} @onDelete={{fn (mut this.didDelete) true}} /></template>,
    );

    await click(".btn-danger");

    assert.ok(this.didDelete);
  });

  test("can be read-only", async function (assert) {
    this.set(
      "report",
      EmberObject.create({
        verifiedBy: EmberObject.create({
          id: 1,
          fullName: "John Doe",
        }),
        billed: true,
      }),
    );

    await render(<template><ReportRow @report={{this.report}} /></template>);

    assert.dom("input").isDisabled();
    assert.dom("form").hasAttribute("title", /John Doe/);
    assert.dom(".btn").doesNotExist();

    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() }),
    );

    assert.dom("input").isNotDisabled();
    assert.dom("form").hasNoAttribute("title");
    assert.dom(".btn").exists({ count: 2 });
  });
});
