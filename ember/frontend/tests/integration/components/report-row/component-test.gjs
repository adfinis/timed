import { fn } from "@ember/helper";
import EmberObject from "@ember/object";
import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import ReportRow from "timed/components/report-row";
import { setupMirage } from "timed/tests/helpers/mirage";

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
      <template>
        <ReportRow
          @report={{this.report}}
          @onDelete={{fn (mut this.didDelete) true}}
        />
      </template>,
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

    // Delete/Save must be disabled in readonly mode, but magic
    // links can still be created
    assert.dom(".btn").exists({ count: 1 });
    assert.dom("[data-test-save-report]").doesNotExist();
    assert.dom("[data-test-delete-report]").doesNotExist();
    assert.dom("[data-test-magic-link-btn]").exists();

    this.set(
      "report",
      EmberObject.create({ verifiedBy: EmberObject.create() }),
    );

    assert.dom("input").isNotDisabled();
    assert.dom("form").hasNoAttribute("title");
    assert.dom(".btn").exists({ count: 3 });

    assert.dom("[data-test-save-report]").exists();
    assert.dom("[data-test-delete-report]").exists();
    assert.dom("[data-test-magic-link-btn]").exists();
  });
});
