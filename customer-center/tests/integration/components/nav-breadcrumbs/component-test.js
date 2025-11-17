import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | nav-breadcrumbs", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.items = [{ label: "Foo", route: "foo" }, { label: "Bar" }];

    await render(hbs`<NavBreadcrumbs @crumbs={{this.items}} />`);

    assert.dom(".breadcrumbs__home").exists({ count: 1 });
    assert.dom(".breadcrumbs__item").exists({ count: this.items.length });

    assert.dom(".breadcrumbs__item:nth-child(2)").hasText("Foo");
    assert.dom(".breadcrumbs__item:nth-child(2) a").exists({ count: 1 });

    assert.dom(".breadcrumbs__item:nth-child(3)").hasText("Bar");
    assert.dom(".breadcrumbs__item:nth-child(3) span").exists({ count: 1 });
  });
});
