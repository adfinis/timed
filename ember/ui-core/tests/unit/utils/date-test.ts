import * as date from "#src/utils/date.ts";
import { DateTime } from "luxon";

import { module, test } from "qunit";

// small helper to reduce typing noise
const fromISO = (s: string) => DateTime.fromISO(s) as DateTime<true>;

module("Unit | Utility | date", function () {
  test("toString works", function (assert) {
    assert.deepEqual(date.toString(fromISO("2022-11-01")), "01.11.2022");

    assert.deepEqual(date.toString(fromISO("2024-04-02")), "02.04.2024");
  });

  test("fromString works", function (assert) {
    // valid dates in the "format"
    assert.deepEqual(date.fromString("01.11.2022"), fromISO("2022-11-01"));
    assert.deepEqual(date.fromString("02.04.2024"), fromISO("2024-04-02"));

    // invalid dates -> invalid DateTimes
    assert.false(date.fromString("not a valid date").isValid);
    assert.false(date.fromString("2026-01-02").isValid);
  });
});
