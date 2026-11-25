import { find, render, settled } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import BalanceDonut from "timed/components/balance-donut";
import { setupMirage } from "timed/tests/helpers/mirage";

/** Selector for the `X / Y` text */
const HOLIDAY_MAIN_TEXT_SELECTOR = "[data-test-holiday-main-text]";

/** Selector for the `+ X Planned` text */
const PLANNED_SUBTEXT_SELECTOR = "[data-test-holiday-subtext]";

/** Selector for the past (part)circle/donut segment */
const PAST_SEGMENT_SELECTOR = "[data-test-past-segment]";

/** Selector for the planned (part)circle/donut segment */
const PLANNED_SEGMENT_SELECTOR = "[data-test-planned-segment]";

/**

* @param {string} selector - query selector for the segment
* @returns {number} the filled out percentage of the circle
*/
const getSegmentPercentage = (selector) =>
  Number(find(selector).getAttribute("stroke-dasharray").split(" ", 1)[0]);

module("Integration | Component | BalanceDonut", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.createBalance = function (options) {
      const store = this.owner.lookup("service:store");

      const balance = this.server.create("absence-balance", options);
      return store.findRecord("absence-balance", balance.id);
    };
  });

  test("AT01 - renders with duration", async function (assert) {
    const balance = await this.createBalance({
      usedDuration: "02:00:00",
    });

    await render(
      <template>
        <BalanceDonut data-test-balance-donut @balance={{balance}} />
      </template>,
    );

    assert.dom("[data-test-balance-type=duration]").exists();
    assert.dom("[data-test-balance-donut]").hasText("02:00");
    assert.dom(PLANNED_SEGMENT_SELECTOR).doesNotExist();
  });

  test("AT02 - renders day without credit", async function (assert) {
    const balance = await this.createBalance({
      usedDays: 2,
    });

    await render(
      <template>
        <BalanceDonut data-test-balance-donut @balance={{balance}} />
      </template>,
    );

    assert.dom("[data-test-balance-type=day]").exists();
    assert.dom("[data-test-balance-donut]").hasText("2");
    assert.dom(PLANNED_SEGMENT_SELECTOR).doesNotExist();
  });

  test("AT03 - renders holidays without planned days", async function (assert) {
    const balance = await this.createBalance({
      credit: 10,
      usedDays: 2,
    });

    await render(
      <template>
        <BalanceDonut
          data-test-balance-donut
          @balance={{balance}}
          @endOfYearBalance={{balance}}
        />
      </template>,
    );

    assert.dom("[data-test-balance-type=holiday]").exists();
    assert.dom("[data-test-balance-donut]").hasText("2 / 10");

    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("2 / 10");
    assert.dom(PLANNED_SEGMENT_SELECTOR).doesNotExist();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).doesNotExist();
  });

  test("AT04 - renders holidays with planned days", async function (assert) {
    const balance = await this.createBalance({
      credit: 10,
      usedDays: 2,
    });

    const endOfYearBalance = await this.createBalance({
      credit: 10,
      usedDays: 4,
    });

    await render(
      <template>
        <BalanceDonut
          data-test-balance-donut
          @balance={{balance}}
          @endOfYearBalance={{endOfYearBalance}}
        />
      </template>,
    );

    assert.dom("[data-test-balance-type=holiday]").exists();
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("2 / 10");

    assert.dom(PLANNED_SEGMENT_SELECTOR).exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).hasText("+2 Planned");

    assert.ok(
      getSegmentPercentage(PLANNED_SEGMENT_SELECTOR) >
        getSegmentPercentage(PAST_SEGMENT_SELECTOR),
    );
  });

  test("AT05 - handling of special cases", async function (assert) {
    const balance = await this.createBalance({
      credit: 10,
      usedDays: 0,
    });

    const endOfYearBalance = await this.createBalance({
      credit: 10,
      usedDays: 0,
    });

    /**
    @param {number} used - used holidays
    @param {number} planned - planned holidays
    @return {Promise<void>}
    */
    const reconfigure = async (used, planned) => {
      balance.usedDays = used;
      endOfYearBalance.usedDays = used + planned;
      await settled();
    };

    await render(
      <template>
        <BalanceDonut
          data-test-balance-donut
          @balance={{balance}}
          @endOfYearBalance={{endOfYearBalance}}
        />
      </template>,
    );

    assert.dom("[data-test-status=ok]").exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).doesNotExist();
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("0 / 10");

    await reconfigure(10, 0);

    assert.dom("[data-test-status=warning]").exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).doesNotExist();
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("10 / 10");

    await reconfigure(11, 0);

    assert.dom("[data-test-status=danger]").exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).doesNotExist();
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("11 / 10");

    await reconfigure(8, 1);

    assert.dom("[data-test-status=ok]").exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).hasText("+1 Planned");
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("8 / 10");

    await reconfigure(8, 2);

    assert.dom("[data-test-status=warning]").exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).hasText("+2 Planned");
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("8 / 10");

    await reconfigure(8, 3);

    assert.dom("[data-test-status=danger]").exists();
    assert.dom(PLANNED_SUBTEXT_SELECTOR).hasText("+3 Planned");
    assert.dom(HOLIDAY_MAIN_TEXT_SELECTOR).hasText("8 / 10");
  });
});
