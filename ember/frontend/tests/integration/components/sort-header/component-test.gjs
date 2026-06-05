import { click, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import SortHeader from "timed/components/sort-header";

module("Integration | Component | sort header", function (hooks) {
  setupRenderingTest(hooks);

  test("renders", async function (assert) {
    await render(
      <template><SortHeader @current="-test" @by="foo" /></template>,
    );
    assert.dom(".fa-sort").exists({ count: 1 });
  });

  test("renders active state", async function (assert) {
    this.set("current", "-test");
    this.set("update", (sort) => {
      this.set("current", sort);
    });

    await render(
      <template>
        <SortHeader
          @current={{this.current}}
          @by="test"
          @update={{this.update}}
        />
      </template>,
    );
    assert.dom(".fa-sort-down").exists({ count: 1 });

    await click(".sort-header");
    assert.dom(".fa-sort-up").exists({ count: 1 });
  });
});
