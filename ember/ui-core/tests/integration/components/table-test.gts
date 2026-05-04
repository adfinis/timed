import { module, test } from "qunit";
import { setupRenderingTest } from "../../helpers";
import { click, render } from "@ember/test-helpers";
import Table, { SelectableTable } from "#src/components/table.gts";

module("Integration | Component | table", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(
      <template>
        <Table @striped={{true}} @hover={{true}} @last={{true}} as |t|>
          <t.thead>
            <t.trh>
              <t.th>Title</t.th>
            </t.trh>
          </t.thead>
          <t.tbody>
            <t.tr data-test-row>
              <t.td>Row</t.td>
            </t.tr>
          </t.tbody>
        </Table>
      </template>,
    );

    assert.dom("[data-test-row]").hasClass("striped");
    assert.dom("[data-test-row]").hasClass("hover:bg-secondary-dark/15");
    assert.dom("[data-test-row]").hasClass("last-of-type:border-b-2");
  });

  test("selectable/selected & @onChange work", async function (assert) {
    let calls = 0;
    const onChange = () => {
      calls += 1;
    };

    await render(
      <template>
        <SelectableTable as |t|>
          <t.tbody>
            <t.tr
              @selectable={{true}}
              @selected={{false}}
              @onChange={{onChange}}
              data-test-selectable
            >
              <t.td>Row</t.td>
            </t.tr>
            <t.tr
              @selectable={{false}}
              @selected={{false}}
              @onChange={{onChange}}
              data-test-disabled
            >
              <t.td>Disabled</t.td>
            </t.tr>
          </t.tbody>
        </SelectableTable>
      </template>,
    );

    await click("[data-test-selectable]");
    assert.strictEqual(calls, 1, "clicking a selectable row triggers onChange");

    await click("[data-test-disabled]");
    assert.strictEqual(calls, 1, "disabled rows do not trigger onChange");
    assert.dom("[data-test-selectable]").hasAttribute("tabindex", "0");
  });
});
