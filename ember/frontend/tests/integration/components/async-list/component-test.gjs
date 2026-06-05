import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import AsyncList from "timed/components/async-list";
import eq from "ember-truth-helpers/helpers/eq";

module("Integration | Component | async list", function (hooks) {
  setupRenderingTest(hooks);

  test("yields list on success", async function (assert) {
    this.set("data", { value: ["a", "b"] });

    await render(
      <template>
        <AsyncList @data={{this.data}} as |section data|>
          {{#if (eq section "body")}}
            {{#each data as |d|}}
              <div class="item">{{d}}</div>
            {{/each}}
          {{/if}}
        </AsyncList>
      </template>,
    );

    assert.dom("div.item").exists({ count: 2 });
  });

  test("yields empty section", async function (assert) {
    this.set("data", { value: [] });

    await render(
      <template>
        <AsyncList @data={{this.data}} as |section|>
          {{#if (eq section "empty")}}
            <div class="check-me"></div>
          {{/if}}
        </AsyncList>
      </template>,
    );

    assert.dom(".check-me").exists();
  });

  test("shows loading icon", async function (assert) {
    this.set("data", { isRunning: true });

    await render(<template><AsyncList @data={{this.data}} /></template>);

    assert.dom(".loading-icon").exists();
  });

  test("shows error message", async function (assert) {
    this.set("data", { isError: true });

    await render(<template><AsyncList @data={{this.data}} /></template>);

    assert.dom(".fa-bolt").exists();
  });
});
