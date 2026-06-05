import { A } from "@ember/array";
import ArrayProxy from "@ember/array/proxy";
import { render, waitFor } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { Duration } from "luxon";
import { module, test } from "qunit";
import StatisticList from "timed/components/statistic-list";

module("Integration | Component | statistic list", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.set("noop", () => {});
  });

  test("renders", async function (assert) {
    await render(<template><StatisticList /></template>);

    assert.dom("div").exists();
  });

  test("shows an error message", async function (assert) {
    this.set("data", { last: { isError: true } });

    await render(
      <template>
        <StatisticList
          @data={{this.data}}
          @type="year"
          @ordering="year"
          @onOrderingChange={{this.noop}}
        />
      </template>,
    );

    assert.dom(".empty").includesText("Oops");
  });

  test("shows an empty message", async function (assert) {
    this.set("data", { last: { value: [] } });

    await render(
      <template>
        <StatisticList
          @data={{this.data}}
          @type="year"
          @ordering="year"
          @onOrderingChange={{this.noop}}
        />
      </template>,
    );

    assert.dom(".empty").includesText("No statistics to display");
  });

  test("shows a loading icon", async function (assert) {
    this.set("data", { isRunning: true });

    await render(
      <template>
        <StatisticList
          @data={{this.data}}
          @type="year"
          @ordering="year"
          @onOrderingChange={{this.noop}}
        />
      </template>,
    );

    assert.dom(".loading-icon").exists();
  });

  test("shows a missing parameters message", async function (assert) {
    this.set("data", { last: { value: [] } });
    this.set("missingParams", ["foo", "bar"]);

    await render(
      <template>
        <StatisticList
          @data={{this.data}}
          @type="year"
          @ordering="year"
          @onOrderingChange={{this.noop}}
          @missingParams={{this.missingParams}}
        />
      </template>,
    );

    assert.dom(".empty").includesText("Foo and bar are required parameters");
  });

  test("renders contents and parses total time", async function (assert) {
    this.set("data", {
      last: {
        value: ArrayProxy.create({
          content: A([
            { duration: Duration.fromObject({ hours: 3 }) },
            { duration: Duration.fromObject({ hours: 6 }) },
          ]),
          meta: {
            "total-time": "1 10:30:00",
          },
        }),
      },
    });

    await render(
      <template>
        <div class="page-content--scroll">
          <StatisticList
            @data={{this.data}}
            @type="year"
            @ordering="year"
            @onOrderingChange={{this.noop}}
          />
        </div>
      </template>,
    );

    await waitFor("table tbody tr");

    assert.dom("[data-test-statistic-list-column]").exists({ count: 4 });
    assert.dom("[data-test-statistic-list-row]").exists({ count: 2 });
    assert.dom(".total").hasText("34h 30m");
  });
});
