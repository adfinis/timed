import { click, fillIn, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | data-table/heading-search", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.text = "Heading";

    await render(hbs`
      <DataTable::HeadingSearch>
        {{this.text}}
      </DataTable::HeadingSearch>
    `);

    assert.dom(".data-table__search").exists({ count: 1 });
    assert.dom(".data-table__search").hasText(this.text);

    assert.dom(".data-table__search__close").exists({ count: 1 });
    assert.dom(".data-table__search__input").exists({ count: 1 });
  });

  test("it handles searches", async function (assert) {
    this.text = "Heading";
    this.handler = () => assert.step("search");
    this.query = "Test";

    await render(hbs`
      <DataTable::HeadingSearch @onSearch={{this.handler}}>
        {{this.text}}
      </DataTable::HeadingSearch>
    `);

    await click(".data-table__search__open");
    await fillIn(".data-table__search__input", this.query);
    await click(".data-table__search__close");

    assert.verifySteps(["search", "search"]);
  });
});
