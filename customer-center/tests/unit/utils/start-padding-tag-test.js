import { module, test } from "qunit";

import startPaddingTag from "customer-center/utils/start-padding-tag";

module("Unit | Utility | start padding tag", function () {
  test("it works", function (assert) {
    const tag = startPaddingTag(2);

    const a = 0;
    const b = 0;

    const expected = "00:00";
    const result = tag`${a}:${b}`;

    assert.strictEqual(result, expected);
  });

  test("it works with hivens", function (assert) {
    const tag = startPaddingTag(10, "-");

    const a = "Hello";
    const b = "World";

    const expected = "-----Hello -----World";
    const result = tag`${a} ${b}`;

    assert.strictEqual(result, expected);
  });

  test("it wotk with white-spaces", function (assert) {
    const tag = startPaddingTag(10, " ");

    const a = "Hello";
    const b = "World";

    const expected = "     Hello      World";
    const result = tag`${a} ${b}`;

    assert.strictEqual(result, expected);
  });
});
