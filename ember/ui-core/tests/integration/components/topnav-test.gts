import { module, test } from "qunit";
import { setupRenderingTest } from "../../helpers";
import { render } from "@ember/test-helpers";
import Topnav from "#src/components/topnav.gts";

module("Integration | Component | topnav", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(
      <template>
        <Topnav as |t|>
          <t.header data-test-header>Brand</t.header>
          <t.nav>
            <t.list as |l|>
              <l.item>
                <t.link @route="index">Home</t.link>
              </l.item>
            </t.list>
          </t.nav>
        </Topnav>
      </template>,
    );

    assert.dom("[data-test-header]").hasText("Brand");
    assert.dom("nav").hasText("Brand Home");
    assert.dom("a").hasText("Home");
  });
});
