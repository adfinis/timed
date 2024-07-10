import { module, test } from "qunit";
import parseFileName from "timed/utils/parse-filename";

module("Unit | Helper | parse filename", function () {
  test("works with double quotes", function (assert) {
    const result = parseFileName(
      'attachment; filename="1805-20240710-Customer-Sample_Project.ods"'
    );

    assert.strictEqual(result, "1805-20240710-Customer-Sample_Project.ods");
  });

  test("works with single quotes", function (assert) {
    const result = parseFileName(
      "attachment; filename='1805-20240710-Customer-Sample_Project.ods'"
    );

    assert.strictEqual(result, "1805-20240710-Customer-Sample_Project.ods");
  });

  test("works without quotes", function (assert) {
    const result = parseFileName(
      "attachment; filename=1805-20240710-Customer-Sample_Project.ods"
    );

    assert.strictEqual(result, "1805-20240710-Customer-Sample_Project.ods");
  });

  test("falls back to 'Unknown file'", function (assert) {
    const result = parseFileName("attachment;");

    assert.strictEqual(result, "Unknown file");
  });
});
