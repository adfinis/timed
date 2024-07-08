import { module, test } from "qunit";
import parseFileName from "timed/utils/parse-filename";

module("Unit | Helper | parse filename", function () {
  test("works with double quotes", function (assert) {
    const result = parseFileName(
      'attachement; filename="2407-20240708-Customer-Big_Project.ods"'
    );

    assert.strictEqual(result, "2407-20240708-Customer-Big_Project.ods");
  });

  test("works with single quotes", function (assert) {
    const result = parseFileName(
      "attachement; filename='2407-20240708-Customer-Big_Project.ods'"
    );

    assert.strictEqual(result, "2407-20240708-Customer-Big_Project.ods");
  });

  test("works without quotes", function (assert) {
    const result = parseFileName(
      "attachement; filename=2407-20240708-Customer-Big_Project.ods"
    );

    assert.strictEqual(result, "2407-20240708-Customer-Big_Project.ods");
  });
});
