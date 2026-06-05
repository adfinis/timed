import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import FilterSidebar from "timed/components/filter-sidebar";
import { fn } from "@ember/helper";

module("Integration | Component | filter sidebar", function (hooks) {
  setupRenderingTest(hooks);

  test("can reset", async function (assert) {
    assert.expect(1);
    this.set("didReset", false);

    await render(
      <template>
        <div id="filter-sidebar-target"></div>
        <FilterSidebar @onReset={{fn (mut this.didReset) true}} />
      </template>,
    );

    await click(".filter-sidebar-reset");

    assert.ok(this.didReset);
  });

  test("shows applied filter count", async function (assert) {
    this.set("count", 0);

    await render(
      <template>
        <div id="filter-sidebar-target"></div>
        <FilterSidebar @appliedCount={{this.count}} />
      </template>,
    );

    assert.dom(".filter-sidebar-title").includesText("Filters");

    this.set("count", 1);

    assert.dom(".filter-sidebar-title").includesText("1 Filter applied");

    this.set("count", 5);

    assert.dom(".filter-sidebar-title").includesText("5 Filters applied");
  });
});
