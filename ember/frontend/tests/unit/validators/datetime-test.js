import { DateTime } from "luxon";
import { module, test } from "qunit";

import validateDateTime from "timed/validators/datetime";

module("Unit | Validator | datetime", function () {
  test("works without value", function (assert) {
    assert.strictEqual(
      validateDateTime()("key", null, null, {}, {}),
      "The given value is not a valid value",
    );
    assert.true(validateDateTime()("key", DateTime.now(), null, {}, {}));
  });

  test("works with gt", function (assert) {
    assert.true(
      validateDateTime({ gt: "otherKey" })(
        "key",
        DateTime.now(),
        null,
        {},
        { otherKey: DateTime.now().plus({ seconds: -1 }) },
      ),
    );

    assert.strictEqual(
      validateDateTime({ gt: "otherKey" })(
        "key",
        DateTime.now(),
        null,
        {},
        { otherKey: DateTime.now().plus({ seconds: 1 }) },
      ),
      "The value is smaller than otherKey",
    );
  });

  test("works with lt", function (assert) {
    assert.true(
      validateDateTime({ lt: "otherKey" })(
        "key",
        DateTime.now(),
        null,
        {},
        { otherKey: DateTime.now().plus({ seconds: 1 }) },
      ),
    );

    assert.strictEqual(
      validateDateTime({ lt: "otherKey" })(
        "key",
        DateTime.now(),
        null,
        {},
        { otherKey: DateTime.now().plus({ seconds: -1 }) },
      ),
      "The value is larger than otherKey",
    );
  });

  test("works with gt and lt", function (assert) {
    assert.true(
      validateDateTime({ lt: "ltKey", gt: "gtKey" })(
        "key",
        DateTime.now(),
        null,
        {},
        {
          gtKey: DateTime.now().plus({ seconds: -1 }),
          ltKey: DateTime.now().plus({ seconds: 1 }),
        },
      ),
    );
  });

  test("works with changes", function (assert) {
    assert.true(
      validateDateTime({ lt: "ltKey", gt: "gtKey" })(
        "key",
        DateTime.now(),
        null,
        {
          gtKey: DateTime.now().plus({ seconds: -1 }),
          ltKey: DateTime.now().plus({ seconds: 1 }),
        },
        {},
      ),
    );
  });

  test("prefers changes before the original object", function (assert) {
    assert.true(
      validateDateTime({ gt: "gtKey" })(
        "key",
        DateTime.now(),
        null,
        {
          gtKey: DateTime.now().plus({ seconds: -1 }),
        },
        {
          gtKey: DateTime.now().plus({ seconds: 1 }),
        },
      ),
    );
  });
});
