import { module, test } from "qunit";
import { setupRenderingTest } from "../../helpers";
import { render } from "@ember/test-helpers";
import Card from "#src/components/card.gts";

module("Integration | Component | card", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(
      <template>
        <Card as |c|>
          <c.header data-test-card-header>Header</c.header>
          <c.block data-test-card-body>Body</c.block>
          <c.footer data-test-card-footer>Footer</c.footer>
        </Card>
      </template>,
    );

    assert.dom(".card").exists();
    assert.dom("[data-test-card-header]").hasText("Header");
    assert.dom("[data-test-card-body]").hasText("Body");
    assert.dom("[data-test-card-footer]").hasText("Footer");
    assert.dom("[data-test-card-header]").hasClass("border-b");
    assert.dom("[data-test-card-footer]").hasClass("border-t");
  });
});
