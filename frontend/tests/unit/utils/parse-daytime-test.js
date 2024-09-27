import { module, test } from "qunit";
import parseDayTime from "timed/utils/parse-daytime";

module("Unit | Utility | parse day time", function () {
  test("works with normal time", function (assert) {
    const result = parseDayTime("02:00");

    assert.deepEqual([2, 0], result);
  });

  test("works with just a number", function (assert) {
    const result = parseDayTime("2");

    assert.deepEqual([2, 0], result);
  });

  test("works without :", function (assert) {
    const result = parseDayTime("230");

    assert.deepEqual([2, 30], result);
  });

  test("doesn't work on minutes that aren't in steps of 15", function (assert) {
    const result = parseDayTime("02:31");

    assert.notDeepEqual([2, 31], result);
    assert.strictEqual(result, null);
  });

  test("doesn't work on hours above 23", function (assert) {
    const result = parseDayTime("24");

    assert.notDeepEqual([24, 0], result);
    assert.strictEqual(result, null);
  });

  test("doesn't work on invalid inputs", function (assert) {
    assert.strictEqual(parseDayTime("abcdef"), null);
    assert.strictEqual(parseDayTime(""), null);
  });
});
